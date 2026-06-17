import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PlayerLink from './PlayerLink';
import { chatService } from '../services/resources';
import { createChatSocket } from '../services/socket';
import { getErrorMessage } from '../services/api';
import { normalizeChatMessage, unwrapList } from '../utils/normalize';
import { formatForumDate } from '../utils/diabloTheme';

function ChatBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-xl border px-4 py-2.5 sm:max-w-[70%] ${
          isOwn
            ? 'border-red-800/50 bg-red-950/40'
            : 'border-zinc-700 bg-zinc-800/60'
        }`}
      >
        {!isOwn && (
          <p className="mb-1 text-xs font-medium">
            <PlayerLink username={message.authorUsername} />
            <span className="ml-1 font-normal text-zinc-500">· {message.authorName}</span>
          </p>
        )}
        <p className="whitespace-pre-wrap break-words text-sm text-zinc-200">{message.content}</p>
        <p className="mt-1 text-right text-[10px] text-zinc-500">{formatForumDate(message.createdAt)}</p>
      </div>
    </div>
  );
}

export default function ForumChat() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const socketRef = useRef(null);
  const listRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      setLoading(true);
      try {
        const history = await chatService.getMessages(50);
        if (active) {
          setMessages(unwrapList(history).map(normalizeChatMessage));
        }
      } catch (err) {
        if (active) setError(getErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    };

    bootstrap();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!token) return undefined;

    const socket = createChatSocket(token);
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      setError('');
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('connect_error', () => {
      setConnected(false);
      setError('Nao foi possivel conectar ao chat. Verifique se o servidor esta online.');
    });

    socket.on('chat:message', (payload) => {
      const normalized = normalizeChatMessage(payload);
      if (!normalized) return;

      setMessages((prev) => {
        if (prev.some((m) => m.id === normalized.id)) return prev;
        return [...prev, normalized];
      });
    });

    socket.on('chat:online', ({ count }) => {
      setOnlineCount(count || 0);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    scrollToBottom(messages.length > 1);
  }, [messages, scrollToBottom]);

  const handleSend = async (event) => {
    event.preventDefault();
    const content = text.trim();
    if (!content || !socketRef.current || sending) return;

    setSending(true);
    setError('');

    socketRef.current.emit('chat:send', { content }, (response) => {
      setSending(false);
      if (response?.error) {
        setError(response.error);
        return;
      }
      setText('');
    });
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] min-h-[420px] flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 px-4 py-3">
        <div>
          <h2 className="font-display text-lg text-amber-500">🔴 Chat ao vivo — Santuário</h2>
          <p className="text-xs text-zinc-500">Converse em tempo real com outros Nephalem</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className={`flex items-center gap-1.5 ${connected ? 'text-green-400' : 'text-zinc-500'}`}>
            <span className={`h-2 w-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-zinc-600'}`} />
            {connected ? 'Conectado' : 'Desconectado'}
          </span>
          <span className="text-zinc-500">👥 {onlineCount} online</span>
        </div>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {loading ? (
          <p className="py-8 text-center text-sm text-zinc-500">⏳ Carregando mensagens...</p>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-3xl" aria-hidden="true">💬</p>
            <p className="mt-2 text-sm text-zinc-400">Ninguém falou ainda. Dê oi ao Santuário!</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              isOwn={message.authorId === user?.id}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="mx-4 mb-2 rounded-lg border border-red-800 bg-red-950/50 px-3 py-2 text-xs text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSend} className="border-t border-zinc-800 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            disabled={!connected || sending}
            placeholder={connected ? 'Digite sua mensagem...' : 'Conectando ao chat...'}
            className="input-field flex-1 py-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={!connected || sending || !text.trim()}
            className="btn-primary shrink-0 px-4 py-2.5 text-sm"
          >
            {sending ? '...' : '📨'}
          </button>
        </div>
        <p className="mt-1 text-xs text-zinc-600">
          <PlayerLink username={user?.username} className="text-xs" /> · {text.length}/1000
        </p>
      </form>
    </div>
  );
}
