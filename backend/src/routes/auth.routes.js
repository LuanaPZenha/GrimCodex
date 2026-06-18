const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { loginRules, registerRules, userCreateRules } = require('../validators');
const { authLimiter } = require('../middlewares/security');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuario
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *               role: { type: string, enum: [user, admin] }
 *     responses:
 *       201:
 *         description: Usuario registrado com sucesso
 */
router.post('/register', authLimiter, registerRules, validate, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica um usuario e retorna JWT
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
router.post('/login', authLimiter, loginRules, validate, authController.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Retorna o perfil do usuario autenticado
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Perfil do usuario
 */
router.get('/profile', authenticate, authController.profile);

module.exports = router;
