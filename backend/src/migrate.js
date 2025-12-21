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

    // Create indexes for better performance
    await db.query(`CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_reels_user ON reels(user_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_reels_created ON reels(created_at DESC);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(target_type, target_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_friendships_user ON friendships(user_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_followers_following ON followers(following_id);`);
    logger.info('All indexes ensured');
    console.log('All indexes ensured');

    logger.info('Migrations applied successfully');
    console.log('Migrations applied successfully');
    process.exit(0);
  } catch (err) {
    logger.error('Migration failed:', err);
    process.exit(1);
  }
}

up();
