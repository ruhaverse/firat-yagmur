const db = require('./config/db');

async function up() {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      profile_picture TEXT,
      created_at TIMESTAMP DEFAULT now()
    );`);

    await db.query(`CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      content TEXT,
      privacy TEXT,
      created_at TIMESTAMP DEFAULT now()
    );`);

    await db.query(`CREATE TABLE IF NOT EXISTS reels (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      caption TEXT,
      created_at TIMESTAMP DEFAULT now()
    );`);

    console.log('Migrations applied');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  }
}

up();
