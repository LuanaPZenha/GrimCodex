const { Server } = require('socket.io');
const { getSocketCorsOrigin } = require('../config/cors');
const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');
const chatService = require('../services/chatService');

const CHAT_ROOM = chatService.DEFAULT_ROOM;
const MESSAGE_COOLDOWN_MS = 800;
const lastMessageAt = new Map();

function getOnlineCount(io) {
  return io.sockets.adapter.rooms.get(CHAT_ROOM)?.size || 0;
}

function broadcastOnlineCount(io) {
  io.to(CHAT_ROOM).emit('chat:online', { count: getOnlineCount(io) });
}

function initChatSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: getSocketCorsOrigin(),
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        throw new Error('Token ausente');
      }

      const decoded = verifyToken(token);
      const user = await User.findByPk(decoded.sub);
      if (!user) {
        throw new Error('Usuario invalido');
      }

      socket.user = user;
      return next();
    } catch {
      return next(new Error('Nao autorizado'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(CHAT_ROOM);
    broadcastOnlineCount(io);

    socket.on('chat:send', async (payload, callback) => {
      try {
        const content = String(payload?.content || payload?.message || '').trim();
        if (!content) {
          callback?.({ error: 'Mensagem vazia' });
          return;
        }
        if (content.length > 1000) {
          callback?.({ error: 'Mensagem muito longa (max 1000 caracteres)' });
          return;
        }

        const userId = socket.user.id;
        const now = Date.now();
        const lastSent = lastMessageAt.get(userId) || 0;
        if (now - lastSent < MESSAGE_COOLDOWN_MS) {
          callback?.({ error: 'Aguarde um momento antes de enviar outra mensagem' });
          return;
        }
        lastMessageAt.set(userId, now);

        const message = await chatService.createMessage({
          content,
          authorId: socket.user.id,
          authorName: socket.user.name,
          authorUsername: socket.user.username,
        });

        const normalized = chatService.toMessageJSON(message);
        io.to(CHAT_ROOM).emit('chat:message', normalized);
        callback?.({ ok: true, message: normalized });
      } catch (error) {
        callback?.({ error: error.message || 'Erro ao enviar mensagem' });
      }
    });

    socket.on('disconnect', () => {
      broadcastOnlineCount(io);
    });
  });

  return io;
}

module.exports = {
  initChatSocket,
  CHAT_ROOM,
};
