const ChatMessage = require('../models/ChatMessage');

const DEFAULT_ROOM = 'sanctuary';
const MAX_HISTORY = 100;

function toMessageJSON(message) {
  if (!message) return null;
  const doc = message.toJSON ? message.toJSON() : message;
  return {
    id: doc.id,
    content: doc.content,
    authorId: doc.authorId,
    authorName: doc.authorName,
    authorUsername: doc.authorUsername,
    room: doc.room || DEFAULT_ROOM,
    createdAt: doc.createdAt,
  };
}

async function listRecentMessages(limit = 50, room = DEFAULT_ROOM) {
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), MAX_HISTORY);
  const messages = await ChatMessage.findAll({
    where: { room },
    order: [['createdAt', 'DESC']],
    limit: safeLimit,
  });

  return messages.reverse().map(toMessageJSON);
}

async function createMessage(data, room = DEFAULT_ROOM) {
  return ChatMessage.create({
    content: data.content,
    authorId: data.authorId,
    authorName: data.authorName,
    authorUsername: data.authorUsername,
    room,
  });
}

module.exports = {
  DEFAULT_ROOM,
  toMessageJSON,
  listRecentMessages,
  createMessage,
};
