# Scaling Roadmap — ShareUptime Backend

This document summarizes recommended approaches for scaling read-heavy features (counters, feeds, search) and lists concrete migration/worker implementation notes.

## Goals
- Keep core schema normalized for data integrity.
- Apply selective denormalization where it measurably improves read performance (counters, feed materialization, search indexes).
- Provide safe, idempotent migration steps and an async worker pattern for high-traffic updates.

## Denormalized Counters

Current counters: `posts.likes_count`, `posts.comments_count`, `reels.likes_count`, `reels.comments_count`, `posts.shares_count`.

Recommended update strategies:

- Trigger (DB-side)
  - Use `AFTER INSERT/DELETE` triggers on `likes`, `comments`, etc. to `UPDATE posts SET likes_count = likes_count + 1`.
  - Pros: strong consistency; simple.
  - Cons: increases write latency and locking contention on hot rows. Not recommended at very large scale.

- Async/event-based (recommended for scale)
  - Emit an event for each counter change (e.g., `likes.created` / `likes.deleted`) to a queue (Redis Stream, RabbitMQ, Kafka).
  - Worker(s) consume events and apply batched/atomic updates to counters (or update Redis ephemeral counters and periodically persist to Postgres).
  - Ensure idempotency (use event IDs, consumer dedupe or idempotent DB operations) and ordering per entity if required.
  - Provide a periodic reconciliation job: recompute counts from base tables and fix drift.

Implementation notes (worker sample)

1. Producer (inside app): push JSON event { type: 'like', action: 'create', target: 'post', target_id, event_id } to `likes-events` stream.
2. Consumer: small Node worker (BullMQ / Kafka consumer) that groups events per `target_id` and issues `UPDATE posts SET likes_count = likes_count + $1 WHERE id = $2` in a single batch.
3. Reconciliation: nightly job `SELECT target_id, count(*) FROM likes GROUP BY target_id` to compare and correct counters.

Example quick-start (BullMQ + Redis):

```bash
# enqueue (app)
node -e "const Queue=require('bullmq').Queue;const q=new Queue('counters',{connection:{host:'localhost'}}); q.add('like', {target:'post',target_id:123});"

# worker (process events, idempotent)
```

## Feed Materialization (Timelines)

Options:

- Fan-out on write: materialize each new post into followers' feed lists.
  - Pros: reads are fast (single read); good when reads >> writes.
  - Cons: high write amplification for popular users.

- Fan-out on read: compute feed on request by querying recent posts from followed users.
  - Pros: simpler writes, no duplication.
  - Cons: slow reads as joins grow, poor UX at scale.

- Hybrid: materialize recent items for heavy users; for others pull-on-read and cache.

Recommendations:

- Start with pull-on-read + Redis caching for the user's feed.
- When reads increase and latency requirements tighten, introduce fan-out-on-write for active followers using a background queue. Persist per-user feed shards in Redis (or a fast store like Scylla/Redis Stream/KeyDB) and keep an eventual-consistent materialized feed table in Postgres for durability.
- Track metrics: feed read latency, queue lag, write amplification, and cache hit rate.

Migration notes

- If adding a materialized feed table: create table `user_feeds(user_id, post_id, inserted_at)` and index `(user_id, inserted_at DESC)`. Use `CREATE INDEX CONCURRENTLY` for production.

## External Search & Ranking

When to move off Postgres FTS:
- Need advanced ranking, large datasets, facet/aggregation heavy queries, or vector/semantic search.

Recommended stack:
- Elasticsearch / OpenSearch for text ranking and aggregations.
- Vector store (Pinecone / Milvus / OpenSearch vectors) for semantic search.

Sync strategy:

- Event-driven sync: publish `posts.created|updated|deleted` events, consumer updates search index.
- Optional CDC (Debezium) for guaranteed eventual consistency.
- Keep search index fields denormalized (include likes_count, comments_count, author snapshot) to avoid cross-service joins at query time.

Operational guidance

- Implement a reindex endpoint / job to rebuild indices.
- Monitor indexing lag, query latency, and index size.

## Partitioning & Index Builds

- For very large tables (`posts`, `comments`, `likes`): consider partitioning by range (`created_at`) or hash (`user_id`).
- Use `CREATE INDEX CONCURRENTLY` for large, live tables to avoid locks.

Migration checklist (example)

1. Add new index statements to `src/migrate.js` but **do not** run `CREATE INDEX` for huge tables in migration in production. Instead, generate SQL and run under maintenance windows:

```sql
-- production (run during low-traffic window)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_author_created ON posts(author_id, created_at DESC);
```

2. Add partitioning using Postgres native partitioning where appropriate (requires careful planning and data migration).

3. Deploy async worker service and event producers with feature flags.

## Monitoring & Reconciliation

- Counters: monitor divergence (worker-applied counters vs ground truth), queue lag, and consumer errors.
- Feed: monitor queue lag, failed deliveries, and per-user feed sizes.
- Search: monitor indexing lag and query errors.

## Safety & Rollback

- Keep idempotent migrations and `ON CONFLICT DO NOTHING` where appropriate.
- For destructive changes (DROP column, partition moves), back up data and use a phased rollout:
  1. Create new table/columns.
  2. Backfill data (idempotent inserts).
  3. Switch read paths to the new structure.
  4. After monitoring, drop old columns.

## Next steps I can help with

- Scaffold a small worker (Node + BullMQ example) to process counter events (idempotent updates + batch writes).
- Generate a production-safe SQL file for `CREATE INDEX CONCURRENTLY` statements for your chosen indexes.
- Draft a maintenance runbook for creating indexes and partitioning.

---
Created: 2025-12-23 — concise roadmap for counters, feeds, and search.
