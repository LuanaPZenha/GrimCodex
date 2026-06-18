require('dotenv').config();
const pool = require('./pool');

const migrate = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        platform VARCHAR(30) NOT NULL DEFAULT 'PC',
        favorite_class VARCHAR(30),
        bio VARCHAR(300),
        hours_played INTEGER NOT NULL DEFAULT 0,
        achievements_completed INTEGER NOT NULL DEFAULT 0,
        most_used_class VARCHAR(30),
        seasons_completed INTEGER NOT NULL DEFAULT 0,
        bosses_defeated INTEGER NOT NULL DEFAULT 0,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        guide_type VARCHAR(20) NOT NULL DEFAULT 'CONQUISTA',
        title VARCHAR(150) NOT NULL,
        category VARCHAR(80) NOT NULL,
        rating INTEGER NOT NULL,
        rarity VARCHAR(20) NOT NULL DEFAULT 'COMUM',
        status VARCHAR(20) NOT NULL DEFAULT 'NA_FILA',
        description VARCHAR(500) NOT NULL,
        guide TEXT NOT NULL DEFAULT '',
        how_to VARCHAR(2000) NOT NULL DEFAULT '',
        average_time VARCHAR(120) NOT NULL DEFAULT '',
        location VARCHAR(500) NOT NULL DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS items_guide_type ON items (guide_type);
      CREATE INDEX IF NOT EXISTS items_category ON items (category);
      CREATE INDEX IF NOT EXISTS items_title_guide_type ON items (title, guide_type);

      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content VARCHAR(5000) NOT NULL,
        category VARCHAR(20) NOT NULL DEFAULT 'GERAL',
        author_id INTEGER NOT NULL,
        author_name VARCHAR(100) NOT NULL,
        author_username VARCHAR(50) NOT NULL,
        reply_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS posts_created_at ON posts (created_at);
      CREATE INDEX IF NOT EXISTS posts_category_created_at ON posts (category, created_at);
      CREATE INDEX IF NOT EXISTS posts_author_id ON posts (author_id);

      CREATE TABLE IF NOT EXISTS replies (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        content VARCHAR(3000) NOT NULL,
        author_id INTEGER NOT NULL,
        author_name VARCHAR(100) NOT NULL,
        author_username VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS replies_post_id_created_at ON replies (post_id, created_at);

      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        content VARCHAR(1000) NOT NULL,
        author_id INTEGER NOT NULL,
        author_name VARCHAR(100) NOT NULL,
        author_username VARCHAR(50) NOT NULL,
        room VARCHAR(50) NOT NULL DEFAULT 'sanctuary',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS chat_messages_room_created_at ON chat_messages (room, created_at);
      CREATE INDEX IF NOT EXISTS chat_messages_author_id ON chat_messages (author_id);

      CREATE TABLE IF NOT EXISTS cars (
        id SERIAL PRIMARY KEY,
        brand VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL,
        color VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS motos (
        id SERIAL PRIMARY KEY,
        brand VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL,
        engine_capacity INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS marcas_roupa (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        country VARCHAR(80) NOT NULL,
        segment VARCHAR(80) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin1234';

    const adminCheck = await client.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [adminEmail, 'admin']
    );

    if (adminCheck.rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash(adminPassword, 12);
      await client.query(
        `INSERT INTO users (
           name, username, email, password, platform, favorite_class, bio, role,
           hours_played, achievements_completed, most_used_class, seasons_completed, bosses_defeated
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [
          'Administrador',
          'admin',
          adminEmail,
          hash,
          'PC',
          'Necromancer',
          'Conta administrativa do Grim Codex.',
          'admin',
          420,
          38,
          'Necromancer',
          4,
          127,
        ]
      );
      console.log(`Admin criado: admin / ${adminPassword}`);
    }
  } finally {
    client.release();
    await pool.end();
  }

  const { runSeeds } = require('./init');
  await runSeeds();

  console.log('Migracao PostgreSQL concluida.');
};

migrate().catch((err) => {
  console.error('Erro na migracao:', err);
  process.exit(1);
});
