const express = require('express');
const carController = require('../controllers/carController');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { carRules, mongoIdParam } = require('../validators');

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Lista todos os carros
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: Lista de carros
 */
router.get('/', carController.list);

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Busca carro por ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Carro encontrado
 */
router.get('/:id', mongoIdParam, validate, carController.getById);

/**
 * @swagger
 * /api/cars:
 *   post:
 *     summary: Cria um carro
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [brand, model, year, color]
 *             properties:
 *               brand: { type: string }
 *               model: { type: string }
 *               year: { type: integer }
 *               color: { type: string }
 *     responses:
 *       201:
 *         description: Carro criado
 */
router.post('/', carRules, validate, carController.create);

/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     summary: Atualiza um carro
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand: { type: string }
 *               model: { type: string }
 *               year: { type: integer }
 *               color: { type: string }
 *     responses:
 *       200:
 *         description: Carro atualizado
 */
router.put('/:id', [...mongoIdParam, ...carRules], validate, carController.update);

/**
 * @swagger
 * /api/cars/{id}:
 *   delete:
 *     summary: Remove um carro
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Carro removido
 */
router.delete('/:id', mongoIdParam, validate, carController.remove);

module.exports = router;
