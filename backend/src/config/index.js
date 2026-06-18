require('dotenv').config();

function parseCorsOrigin(value) {
  const raw = value || '*';
  if (raw === '*') return '*';
  const origins = raw.split(',').map((item) => item.trim()).filter(Boolean);
  return origins.length <= 1 ? origins[0] || '*' : origins;
}

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  postgres: {
    url: process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    database: process.env.POSTGRES_DB || 'appdb',
    username: process.env.POSTGRES_USER || 'appuser',
    password: process.env.POSTGRES_PASSWORD || 'apppassword',
    ssl: process.env.POSTGRES_SSL === 'true'
      || Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL),
  },
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN),
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
};
