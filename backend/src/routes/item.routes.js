const express = require('express');
const itemController = require('../controllers/itemController');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { itemRules, mongoIdParam } = require('../validators');

const router = express.Router();

router.use(authenticate);

router.get('/', itemController.list);
router.get('/:id', mongoIdParam, validate, itemController.getById);
router.post('/', itemRules, validate, itemController.create);
router.put('/:id', [...mongoIdParam, ...itemRules], validate, itemController.update);
router.delete('/:id', mongoIdParam, validate, itemController.remove);

module.exports = router;
