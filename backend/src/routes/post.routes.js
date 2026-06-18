const express = require('express');
const postController = require('../controllers/postController');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const {
  postRules,
  postUpdateRules,
  replyRules,
  mongoIdParam,
  mongoReplyIdParam,
} = require('../validators');

const router = express.Router();

router.use(authenticate);

router.get('/', postController.list);
router.get('/:id', mongoIdParam, validate, postController.getById);
router.post('/', postRules, validate, postController.create);
router.put('/:id', [...mongoIdParam, ...postUpdateRules], validate, postController.update);
router.delete('/:id', mongoIdParam, validate, postController.remove);
router.post('/:id/replies', [...mongoIdParam, ...replyRules], validate, postController.addReply);
router.delete('/:id/replies/:replyId', [...mongoIdParam, ...mongoReplyIdParam], validate, postController.removeReply);

module.exports = router;
