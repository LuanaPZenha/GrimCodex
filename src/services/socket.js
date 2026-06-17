import { io } from 'socket.io-client';
import { getAppConfig } from './config';

export function createChatSocket(token) {
  const { socketUrl } = getAppConfig();
  if (!token || !socketUrl) return null;

  return io(socketUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });
}
