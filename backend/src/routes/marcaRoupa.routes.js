const express = require('express');
const marcaRoupaController = require('../controllers/marcaRoupaController');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { marcaRoupaRules, mongoIdParam } = require('../validators');

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/marcas-roupa:
 *   get:
 *     summary: Lista todas as marcas de roupa
 *     tags: [Marcas de Roupa]
 *     responses:
 *       200:
 *         description: Lista de marcas
 */
router.get('/', marcaRoupaController.list);

/**
 * @swagger
 * /api/marcas-roupa/{id}:
 *   get:
 *     summary: Busca marca de roupa por ID
 *     tags: [Marcas de Roupa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Marca encontrada
 */
router.get('/:id', mongoIdParam, validate, marcaRoupaController.getById);

/**
 * @swagger
 * /api/marcas-roupa:
 *   post:
 *     summary: Cria uma marca de roupa
 *     tags: [Marcas de Roupa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, country, segment]
 *             properties:
 *               name: { type: string }
 *               country: { type: string }
 *               segment: { type: string }
 *     responses:
 *       201:
 *         description: Marca criada
 */
router.post('/', marcaRoupaRules, validate, marcaRoupaController.create);

/**
 * @swagger
 * /api/marcas-roupa/{id}:
 *   put:
 *     summary: Atualiza uma marca de roupa
 *     tags: [Marcas de Roupa]
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
 *               name: { type: string }
 *               country: { type: string }
 *               segment: { type: string }
 *     responses:
 *       200:
 *         description: Marca atualizada
 */
router.put('/:id', [...mongoIdParam, ...marcaRoupaRules], validate, marcaRoupaController.update);

/**
 * @swagger
 * /api/marcas-roupa/{id}:
 *   delete:
 *     summary: Remove uma marca de roupa
 *     tags: [Marcas de Roupa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Marca removida
 */
router.delete('/:id', mongoIdParam, validate, marcaRoupaController.remove);

module.exports = router;
