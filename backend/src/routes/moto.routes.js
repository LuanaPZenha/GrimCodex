const express = require('express');
const motoController = require('../controllers/motoController');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { motoRules, mongoIdParam } = require('../validators');

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/motos:
 *   get:
 *     summary: Lista todas as motos
 *     tags: [Motos]
 *     responses:
 *       200:
 *         description: Lista de motos
 */
router.get('/', motoController.list);

/**
 * @swagger
 * /api/motos/{id}:
 *   get:
 *     summary: Busca moto por ID
 *     tags: [Motos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Moto encontrada
 */
router.get('/:id', mongoIdParam, validate, motoController.getById);

/**
 * @swagger
 * /api/motos:
 *   post:
 *     summary: Cria uma moto
 *     tags: [Motos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [brand, model, year, engineCapacity]
 *             properties:
 *               brand: { type: string }
 *               model: { type: string }
 *               year: { type: integer }
 *               engineCapacity: { type: integer }
 *     responses:
 *       201:
 *         description: Moto criada
 */
router.post('/', motoRules, validate, motoController.create);

/**
 * @swagger
 * /api/motos/{id}:
 *   put:
 *     summary: Atualiza uma moto
 *     tags: [Motos]
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
 *               engineCapacity: { type: integer }
 *     responses:
 *       200:
 *         description: Moto atualizada
 */
router.put('/:id', [...mongoIdParam, ...motoRules], validate, motoController.update);

/**
 * @swagger
 * /api/motos/{id}:
 *   delete:
 *     summary: Remove uma moto
 *     tags: [Motos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Moto removida
 */
router.delete('/:id', mongoIdParam, validate, motoController.remove);

module.exports = router;
