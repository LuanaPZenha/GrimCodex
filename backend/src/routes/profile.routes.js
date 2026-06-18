const express = require('express');
const profileController = require('../controllers/profileController');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { profileStatsRules, usernameParamRules } = require('../validators');

const router = express.Router();

router.use(authenticate);

router.get('/', profileController.list);
router.get('/me', profileController.me);
router.put('/me/stats', profileStatsRules, validate, profileController.updateStats);
router.get('/:username', usernameParamRules, validate, profileController.getByUsername);

module.exports = router;
