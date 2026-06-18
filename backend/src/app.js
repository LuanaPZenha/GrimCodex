const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const {
  helmetMiddleware,
  corsMiddleware,
  apiLimiter,
} = require('./middlewares/security');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const carRoutes = require('./routes/car.routes');
const motoRoutes = require('./routes/moto.routes');
const marcaRoupaRoutes = require('./routes/marcaRoupa.routes');
const itemRoutes = require('./routes/item.routes');
const postRoutes = require('./routes/post.routes');
const chatRoutes = require('./routes/chat.routes');
const profileRoutes = require('./routes/profile.routes');

const config = require('./config');

const app = express();

if (config.env === 'production') {
  app.set('trust proxy', 1);
}

app.disable('x-powered-by');
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: '10kb' }));
app.use(apiLimiter);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check da aplicacao
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Aplicacao saudavel
 */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => {
  res.json(swaggerSpec);
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/motos', motoRoutes);
app.use('/api/marcas-roupa', marcaRoupaRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/profiles', profileRoutes);

app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
