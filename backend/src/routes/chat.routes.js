const express = require('express');
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);
router.get('/messages', chatController.listMessages);

module.exports = router;
