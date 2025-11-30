const db = require('./config/db');
const logger = require('./utils/logger');

async function up() {
  try {
    // Users table
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

    // Post media table
    await db.query(`CREATE TABLE IF NOT EXISTS post_media (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
      media_url TEXT NOT NULL,
      media_type TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now()
    );`);

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
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );`);

    // Reel media table
    await db.query(`CREATE TABLE IF NOT EXISTS reel_media (
      id SERIAL PRIMARY KEY,
      reel_id INTEGER REFERENCES reels(id) ON DELETE CASCADE,
      media_url TEXT NOT NULL,
      media_type TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now()
    );`);

    // Comments table
    await db.query(`CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );`);

    // Likes table (for posts, reels, comments)
    await db.query(`CREATE TABLE IF NOT EXISTS likes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      target_type TEXT NOT NULL, -- 'post', 'reel', 'comment'
      target_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT now(),
      UNIQUE(user_id, target_type, target_id)
    );`);

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

    // Followers table
    await db.query(`CREATE TABLE IF NOT EXISTS followers (
      id SERIAL PRIMARY KEY,
      follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT now(),
      UNIQUE(follower_id, following_id)
    );`);

    // Create indexes for better performance
    await db.query(`CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_reels_user ON reels(user_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_reels_created ON reels(created_at DESC);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(target_type, target_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_friendships_user ON friendships(user_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_followers_following ON followers(following_id);`);

    logger.info('Migrations applied successfully');
    process.exit(0);
  } catch (err) {
    logger.error('Migration failed:', err);
    process.exit(1);
  }
}

up();
