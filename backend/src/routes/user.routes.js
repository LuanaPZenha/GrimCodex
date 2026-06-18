const express = require('express');
const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');
const { userCreateRules, userUpdateRules } = require('../validators');
const { param } = require('express-validator');

const router = express.Router();

router.use(authenticate, authorize('admin'));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lista todos os usuarios (admin)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/', userController.list);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Busca usuario por ID (admin)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Usuario encontrado
 */
router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('ID invalido'), validate],
  userController.getById
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Cria um usuario (admin)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [user, admin] }
 *     responses:
 *       201:
 *         description: Usuario criado
 */
router.post('/', userCreateRules, validate, userController.create);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualiza um usuario (admin)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string }
 *     responses:
 *       200:
 *         description: Usuario atualizado
 */
router.put('/:id', userUpdateRules, validate, userController.update);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Remove um usuario (admin)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Usuario removido
 */
router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('ID invalido'), validate],
  userController.remove
);

module.exports = router;
