const db = require('./config/db');
const logger = require('./utils/logger');

// NOTE: This script must be able to create all tables from scratch on a new machine.
// It is safe to run multiple times (uses IF NOT EXISTS). It logs progress so
// automated deployments or CI can verify success.

async function up() {

  console.log('Starting migrations...');
  try {
    // Users table (must be first for FK dependencies)
    await db.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      profile_picture TEXT,
      bio TEXT,
      location TEXT,
      phone TEXT,
      is_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );`);
    logger.info('Users table ensured');
    console.log('Users table ensured');

    // Roles table and user_roles mapping for RBAC
    await db.query(`CREATE TABLE IF NOT EXISTS roles (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT now()
    );`);
    await db.query(`CREATE TABLE IF NOT EXISTS user_roles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT now(),
      UNIQUE(user_id, role_id)
    );`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);`);
    logger.info('Roles and user_roles tables ensured');
    console.log('Roles and user_roles tables ensured');

    // Seed default roles (idempotent)
    await db.query(`INSERT INTO roles (name, description) VALUES
      ('admin', 'Administrator - full access'),
      ('moderator', 'Moderator - limited administrative actions'),
      ('user', 'Regular authenticated user')
    ON CONFLICT (name) DO NOTHING;`);
    logger.info('Default roles seeded');
    console.log('Default roles seeded');

    // Swaps table (references users)
    await db.query(`CREATE TABLE IF NOT EXISTS swaps (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      media_url TEXT,
      location TEXT,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_swaps_user_id ON swaps(user_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_swaps_created_at ON swaps(created_at);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_swaps_status ON swaps(status);`);
    logger.info('Swaps table ensured');
    console.log('Swaps table ensured');
    
    // Saved swaps table
    await db.query(`CREATE TABLE IF NOT EXISTS saved_swaps (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      swap_id INTEGER NOT NULL REFERENCES swaps(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (user_id, swap_id)
    );`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_saved_swaps_user_id ON saved_swaps(user_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_saved_swaps_swap_id ON saved_swaps(swap_id);`);
    logger.info('Saved_swaps table ensured');
    console.log('Saved_swaps table ensured');

    // Posts table with enhanced fields
    await db.query(`CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      content TEXT,
      privacy TEXT DEFAULT 'public',
      likes_count INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      shares_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );`);
    logger.info('Posts table ensured');
    console.log('Posts table ensured');

    // Post media table
    await db.query(`CREATE TABLE IF NOT EXISTS post_media (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
      media_url TEXT NOT NULL,
      media_type TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now()
    );`);
    logger.info('Post media table ensured');
    console.log('Post media table ensured');

    // Saved posts table (for users saving posts)
    await db.query(`CREATE TABLE IF NOT EXISTS saved_posts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (user_id, post_id)
    );`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_saved_posts_user_id ON saved_posts(user_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_saved_posts_post_id ON saved_posts(post_id);`);
    logger.info('Saved_posts table ensured');
    console.log('Saved_posts table ensured');

    // Swap media table (store multiple media items per swap)
    await db.query(`CREATE TABLE IF NOT EXISTS swap_media (
      id SERIAL PRIMARY KEY,
      swap_id INTEGER REFERENCES swaps(id) ON DELETE CASCADE,
      media_url TEXT NOT NULL,
      media_type TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now()
    );`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_swap_media_swap_id ON swap_media(swap_id);`);
    logger.info('Swap_media table ensured');
    console.log('Swap_media table ensured');

    // Reels table with enhanced fields
    await db.query(`CREATE TABLE IF NOT EXISTS reels (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      caption TEXT,
      video_url TEXT,
      thumbnail_url TEXT,
      duration INTEGER,
      likes_count INTEGER DEFAULT 0,
      views_count INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      -- source is an optional short string to track origin of creation (frontend, import, etc.)
      -- We keep it nullable and don't backfill existing rows.
      source TEXT,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );`);
    logger.info('Reels table ensured');
    console.log('Reels table ensured');

    // Reel media table
    await db.query(`CREATE TABLE IF NOT EXISTS reel_media (
      id SERIAL PRIMARY KEY,
      reel_id INTEGER REFERENCES reels(id) ON DELETE CASCADE,
      media_url TEXT NOT NULL,
      media_type TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now()
    );`);
    logger.info('Reel media table ensured');
    console.log('Reel media table ensured');

    // Saved reels table (users can save reels)
    await db.query(`CREATE TABLE IF NOT EXISTS saved_reels (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      reel_id INTEGER NOT NULL REFERENCES reels(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (user_id, reel_id)
    );`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_saved_reels_user_id ON saved_reels(user_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_saved_reels_reel_id ON saved_reels(reel_id);`);
    logger.info('Saved_reels table ensured');
    console.log('Saved_reels table ensured');

    // Comments table (supports posts, reels, swaps)
    await db.query(`CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
      reel_id INTEGER REFERENCES reels(id) ON DELETE CASCADE,
      swap_id INTEGER REFERENCES swaps(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
      target_type TEXT NOT NULL DEFAULT 'post', -- 'post', 'reel', 'swap'
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );`);
    logger.info('Comments table ensured');
    console.log('Comments table ensured');

    // Notifications and preferences
    await db.query(`CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      actor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      type TEXT NOT NULL,
      target_type TEXT,
      target_id INTEGER,
      data JSONB,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT now()
    );`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);`);
    logger.info('Notifications table ensured');
    console.log('Notifications table ensured');

    await db.query(`CREATE TABLE IF NOT EXISTS notification_preferences (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      notification_type TEXT NOT NULL,
      enabled BOOLEAN DEFAULT true,
      channels TEXT[],
      created_at TIMESTAMP DEFAULT now(),
      UNIQUE(user_id, notification_type)
    );`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_notification_prefs_user_id ON notification_preferences(user_id);`);
    logger.info('Notification preferences table ensured');
    console.log('Notification preferences table ensured');

    // Normalize channels array into a separate table to satisfy 1NF
    await db.query(`CREATE TABLE IF NOT EXISTS notification_preference_channels (
      id SERIAL PRIMARY KEY,
      preference_id INTEGER NOT NULL REFERENCES notification_preferences(id) ON DELETE CASCADE,
      channel TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now(),
      UNIQUE(preference_id, channel)
    );`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_notification_pref_channels_pref_id ON notification_preference_channels(preference_id);`);

    // Backfill existing channels arrays into the normalized table (idempotent)
    await db.query(`INSERT INTO notification_preference_channels (preference_id, channel, created_at)
      SELECT np.id, ch, now()
      FROM notification_preferences np, unnest(coalesce(np.channels, ARRAY[]::text[])) AS ch
      WHERE np.channels IS NOT NULL AND array_length(np.channels,1) > 0
      ON CONFLICT (preference_id, channel) DO NOTHING;`);
    logger.info('Notification preference channels table ensured and backfilled');
    console.log('Notification preference channels table ensured and backfilled');

    // After backfill, drop the old channels array column to enforce 1NF (idempotent)
    await db.query(`ALTER TABLE notification_preferences DROP COLUMN IF EXISTS channels;`);
    logger.info('Dropped notification_preferences.channels column (if existed)');
    console.log('Dropped notification_preferences.channels column (if existed)');

    // Likes table (for posts, reels, comments, swaps)
    await db.query(`CREATE TABLE IF NOT EXISTS likes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      target_type TEXT NOT NULL, -- 'post', 'reel', 'comment', 'swap'
      target_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT now(),
      UNIQUE(user_id, target_type, target_id)
    );`);
    logger.info('Likes table ensured');
    console.log('Likes table ensured');

    // Friendships table
    await db.query(`CREATE TABLE IF NOT EXISTS friendships (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      UNIQUE(user_id, friend_id)
    );`);
    logger.info('Friendships table ensured');
    console.log('Friendships table ensured');

    // Followers table
    await db.query(`CREATE TABLE IF NOT EXISTS followers (
      id SERIAL PRIMARY KEY,
      follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT now(),
      UNIQUE(follower_id, following_id)
    );`);
    logger.info('Followers table ensured');
    console.log('Followers table ensured');

    // Create full-text search GIN indexes for posts and reels
    await db.query(`CREATE INDEX IF NOT EXISTS idx_posts_fts ON posts USING GIN (to_tsvector('english', coalesce(content, '')));`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_reels_fts ON reels USING GIN (to_tsvector('english', coalesce(caption, '')));`);

    // Create indexes for better performance
    await db.query(`CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_reels_user ON reels(user_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_reels_created ON reels(created_at DESC);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);`);
    // Optionally create explicit indexes for FK columns that lacked them
    // Use CONCURRENTLY in production by setting MIGRATE_USE_CONCURRENTLY=true
    const useConcurrently = process.env.MIGRATE_USE_CONCURRENTLY === 'true';
    const fkIndexTargets = [
      { table: 'comments', column: 'parent_comment_id', name: 'idx_comments_parent_comment_id' },
      { table: 'notifications', column: 'actor_id', name: 'idx_notifications_actor_id' }
    ];
    for (const t of fkIndexTargets) {
      if (useConcurrently) {
        const exists = await db.query(`SELECT 1 FROM pg_class WHERE relkind='i' AND relname=$1`, [t.name]);
        if (exists.rowCount === 0) {
          // CREATE INDEX CONCURRENTLY must not run inside a transaction; our driver issues single statements,
          // so this should be safe in most deploys. For very large tables prefer running manually during maintenance.
          await db.query(`CREATE INDEX CONCURRENTLY ${t.name} ON ${t.table}(${t.column});`);
        }
      } else {
        await db.query(`CREATE INDEX IF NOT EXISTS ${t.name} ON ${t.table}(${t.column});`);
      }
    }
    await db.query(`CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(target_type, target_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_friendships_user ON friendships(user_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_followers_following ON followers(following_id);`);
    // Additional indexes and updated_at support for media/saved tables
    await db.query(`CREATE INDEX IF NOT EXISTS idx_post_media_post_id ON post_media(post_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_reel_media_reel_id ON reel_media(reel_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_swap_media_swap_id ON swap_media(swap_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_comments_reel ON comments(reel_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_comments_swap ON comments(swap_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);`);

    // Composite indexes to help pagination and common access patterns
    await db.query(`CREATE INDEX IF NOT EXISTS idx_posts_author_created ON posts(author_id, created_at DESC);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_reels_user_created ON reels(user_id, created_at DESC);`);

    // Backfill / ensure `source` column exists for older deployments where reels table was created earlier
    await db.query(`DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns WHERE table_name='reels' AND column_name='source'
      ) THEN
        ALTER TABLE reels ADD COLUMN source TEXT;
      END IF;
    END$$;`);

    // Ensure updated_at trigger function exists
    await db.query(`DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = now();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      END IF;
    END$$;`);

    // Add updated_at to tables that currently have only created_at and attach triggers
    const addUpdatedAtTables = ['post_media','reel_media','swap_media','saved_posts','saved_reels','saved_swaps'];
    for (const t of addUpdatedAtTables) {
      await db.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='${t}' AND column_name='updated_at') THEN ALTER TABLE ${t} ADD COLUMN updated_at TIMESTAMP DEFAULT now(); END IF; END$$;`);
      await db.query(`DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = ('trg_'||'${t}'||'_updated_at')
        ) THEN
          EXECUTE 'CREATE TRIGGER trg_'||'${t}'||'_updated_at BEFORE UPDATE ON ${t} FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();';
        END IF;
      END$$;`);
    }

    logger.info('All indexes and updated_at triggers ensured');
    console.log('All indexes and updated_at triggers ensured');

    logger.info('Migrations applied successfully');
    console.log('Migrations applied successfully');
    process.exit(0);
  } catch (err) {
    logger.error('Migration failed:', err);
    process.exit(1);
  }
}

up();
