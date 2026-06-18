const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('../config');
const { resolveCorsOrigin } = require('../config/cors');

const helmetMiddleware = helmet({
  contentSecurityPolicy: config.env === 'production',
  crossOriginEmbedderPolicy: false,
});

const corsMiddleware = cors({
  origin: config.corsOrigin === '*' ? true : resolveCorsOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

const noopLimiter = (_req, _res, next) => next();

const apiLimiter =
  config.env === 'test'
    ? noopLimiter
    : rateLimit({
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.max,
        standardHeaders: true,
        legacyHeaders: false,
        message: { message: 'Muitas requisicoes. Tente novamente mais tarde.' },
      });

const authLimiter =
  config.env === 'test'
    ? noopLimiter
    : rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 20,
        message: { message: 'Muitas tentativas de autenticacao. Tente novamente mais tarde.' },
      });

module.exports = {
  helmetMiddleware,
  corsMiddleware,
  apiLimiter,
  authLimiter,
};
