**Summary**
- **What:** Add `update_updated_at_column()` trigger, `updated_at` columns on several media/saved tables, attach per-table BEFORE UPDATE triggers, and create missing single-column and composite indexes.
- **Where:** Changes applied to the `shareup` PostgreSQL database and made idempotent in `src/migrate.js` so migrations apply these permanently. See [src/migrate.js](src/migrate.js).

**Trigger Function**
- **Name:** `update_updated_at_column()`
- **Definition:** a small PL/pgSQL trigger function that sets `NEW.updated_at = now()` and returns `NEW`.
- **Why:** ensures `updated_at` is always current when a row is updated regardless of application code.
- **Idempotence:** created only if the function does not already exist.

**Updated Columns**
- **Tables updated:** `post_media`, `reel_media`, `swap_media`, `saved_posts`, `saved_reels`, `saved_swaps`.
- **Column:** `updated_at TIMESTAMP DEFAULT now()` added to each table idempotently (ALTER IF NOT EXISTS-like check used).
- **Why:** provides a reliable modification timestamp for auditing, cache invalidation, and sync/replication logic.

**Triggers Added**
- **Trigger names:** `trg_post_media_updated_at`, `trg_reel_media_updated_at`, `trg_swap_media_updated_at`, `trg_saved_posts_updated_at`, `trg_saved_reels_updated_at`, `trg_saved_swaps_updated_at`.
- **Behavior:** BEFORE UPDATE FOR EACH ROW invokes `update_updated_at_column()` to set the `updated_at` column.
- **Idempotence:** each trigger is created only if it does not already exist.

**Indexes Added**
- **Single-column indexes:**
  - `idx_post_media_post_id` on `post_media(post_id)`
  - `idx_reel_media_reel_id` on `reel_media(reel_id)`
  - `idx_swap_media_swap_id` on `swap_media(swap_id)`
  - `idx_comments_reel` on `comments(reel_id)`
  - `idx_comments_swap` on `comments(swap_id)`
  - `idx_comments_user` on `comments(user_id)`
- **Composite / multi-column indexes:**
  - `idx_posts_author_created` on `posts(author_id, created_at DESC)` — optimize author feed pagination
  - `idx_reels_user_created` on `reels(user_id, created_at DESC)` — optimize user reels pagination
  - `idx_likes_user_target` on `likes(user_id, target_type, target_id)` — optimize checking whether a user liked a target
- **Idempotence:** all `CREATE INDEX IF NOT EXISTS` guarded statements are used.

**Rationale**
- Correctness: `updated_at` ensures a canonical modification timestamp independent of application logic; triggers prevent accidental omission.
- Performance: media and comments indexes avoid full table scans when retrieving media or comments by parent id; composite indexes accelerate paginated queries that filter by author/user and sort by time.
- Safety: all operations are idempotent; running migrations repeatedly is safe.

**Rollback Notes**
- To revert the changes manually:
  - Drop triggers: `DROP TRIGGER IF EXISTS trg_post_media_updated_at ON post_media;` (repeat for each `trg_*`)
  - Drop function if desired: `DROP FUNCTION IF EXISTS update_updated_at_column();`
  - Drop added columns (data will be lost): `ALTER TABLE post_media DROP COLUMN IF EXISTS updated_at;` (repeat for each table)
  - Drop indexes: `DROP INDEX IF EXISTS idx_post_media_post_id;` etc.
- IMPORTANT: dropping `updated_at` columns will permanently remove modification timestamps; prefer leaving them in place.

**Production considerations**
- For large production tables prefer `CREATE INDEX CONCURRENTLY` to avoid long locks. `CONCURRENTLY` cannot run inside a transaction block (so it is not used inside `DO $$` transactional blocks). Example safe plan:

```sql
-- Run during maintenance window
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_author_created ON posts(author_id, created_at DESC);
```

- When running `CONCURRENTLY`, ensure the database has enough I/O and CPU headroom and monitor progress.

**Verification queries**
- List indexes added:

```sql
SELECT tablename, indexname FROM pg_indexes WHERE indexname IN (
  'idx_post_media_post_id','idx_reel_media_reel_id','idx_swap_media_swap_id',
  'idx_comments_reel','idx_comments_swap','idx_comments_user',
  'idx_posts_author_created','idx_reels_user_created','idx_likes_user_target'
);
```

- Confirm `updated_at` columns:

```sql
SELECT table_name, column_name FROM information_schema.columns
WHERE table_name IN ('post_media','reel_media','swap_media','saved_posts','saved_reels','saved_swaps')
AND column_name = 'updated_at';
```

- Confirm triggers exist:

```sql
SELECT tgname, tgrelid::regclass::text AS table_name FROM pg_trigger WHERE tgname LIKE 'trg_%_updated_at';
```

**Files changed**
- Migration file with the idempotent changes: [src/migrate.js](src/migrate.js)

**Next steps**
- Consider converting index creation to `CONCURRENTLY` for large tables and adding a short-run playbook for production deployments.
- Add a short integration test validating that updating rows updates `updated_at` automatically.

---

Generated on 2025-12-23
