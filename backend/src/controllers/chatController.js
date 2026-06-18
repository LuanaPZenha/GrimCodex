const chatService = require('../services/chatService');

async function listMessages(req, res, next) {
  try {
    const limit = req.query.limit || 50;
    const messages = await chatService.listRecentMessages(limit);
    res.json(messages);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listMessages,
};
