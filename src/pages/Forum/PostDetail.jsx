import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import PlayerLink from '../../components/PlayerLink';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { postsService } from '../../services/resources';
import { getErrorMessage } from '../../services/api';
import { normalizePost, normalizeReply, toPostPayload, toReplyPayload } from '../../utils/normalize';
import { FORUM_CATEGORIES, formatForumDate, getForumCategory } from '../../utils/diabloTheme';

const CATEGORY_OPTIONS = Object.keys(FORUM_CATEGORIES);

function EditPostModal({ open, onClose, post, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', content: '', category: 'GERAL' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && post) {
      setForm({ title: post.title, content: post.content, category: post.category });
      setError('');
    }
  }, [open, post]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await postsService.update(post.id, toPostPayload(form));
      toast.success('Tópico atualizado.');
      onSaved();
      onClose();
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!post) return null;

  return (
    <Modal open={open} onClose={onClose} title="✏️ Editar tópico" size="lg">
      {error && (
        <div className="mb-4 rounded-lg border border-red-800 bg-red-950/60 px-4 py-3 text-sm text-red-300">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          required
          maxLength={200}
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          className="input-field"
        />
        <select
          name="category"
          value={form.category}
          onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
          className="input-field"
        >
          {CATEGORY_OPTIONS.map((key) => (
            <option key={key} value={key}>
              {FORUM_CATEGORIES[key].emoji} {FORUM_CATEGORIES[key].label}
            </option>
          ))}
        </select>
        <textarea
          name="content"
          required
          rows={8}
          maxLength={5000}
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          className="input-field resize-y"
        />
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = String(user?.role || '').toLowerCase() === 'admin';
  const canEditPost = post && (isAdmin || user?.id === post.authorId);
  const canDeletePost = canEditPost;

  const loadPost = async () => {
    setLoading(true);
    try {
      const data = await postsService.getById(id);
      setPost(normalizePost(data.post || data));
      setReplies((data.replies || []).map(normalizeReply));
    } catch (err) {
      toast.error(getErrorMessage(err));
      navigate('/forum');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  const handleReply = async (event) => {
    event.preventDefault();
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    try {
      await postsService.addReply(id, toReplyPayload(replyText.trim()));
      setReplyText('');
      toast.success('Resposta publicada!');
      loadPost();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Excluir este tópico e todas as respostas?')) return;
    setDeleting(true);
    try {
      await postsService.remove(id);
      toast.success('Tópico excluído.');
      navigate('/forum');
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleting(false);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Excluir esta resposta?')) return;
    try {
      await postsService.removeReply(id, replyId);
      toast.success('Resposta excluída.');
      loadPost();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-zinc-500">⏳ Carregando tópico...</div>;
  }

  if (!post) return null;

  const category = getForumCategory(post.category);

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/forum" className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-amber-500">
        ← Voltar ao fórum
      </Link>

      <article className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${category.color}`}>
            {category.emoji} {category.label}
          </span>
          <span className="text-xs text-zinc-500">{formatForumDate(post.createdAt)}</span>
        </div>

        <h1 className="font-display text-2xl font-bold text-zinc-100 sm:text-3xl">{post.title}</h1>

        <div className="mt-3 flex items-center gap-2 text-sm text-zinc-500">
          <span>🧙 <PlayerLink username={post.authorUsername} /></span>
          <span>·</span>
          <span>{post.authorName}</span>
        </div>

        <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{post.content}</div>

        {canEditPost && (
          <div className="mt-6 flex gap-3 border-t border-zinc-800 pt-4">
            <button type="button" onClick={() => setEditOpen(true)} className="btn-secondary text-sm">
              ✏️ Editar
            </button>
            {canDeletePost && (
              <button type="button" onClick={handleDeletePost} disabled={deleting} className="btn-danger text-sm">
                {deleting ? 'Excluindo...' : '🗑️ Excluir tópico'}
              </button>
            )}
          </div>
        )}
      </article>

      <section className="mt-8">
        <h2 className="mb-4 font-display text-lg text-amber-500">
          💬 Respostas ({replies.length})
        </h2>

        {replies.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-700 py-8 text-center text-sm text-zinc-500">
            Nenhuma resposta ainda. Seja o primeiro a ajudar!
          </p>
        ) : (
          <div className="space-y-4">
            {replies.map((reply) => {
              const canDeleteReply =
                isAdmin || user?.id === reply.authorId || user?.id === post.authorId;

              return (
                <div key={reply.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-zinc-500">
                      <PlayerLink username={reply.authorUsername} className="text-zinc-400" />
                      {' · '}
                      {reply.authorName}
                      {' · '}
                      {formatForumDate(reply.createdAt)}
                    </div>
                    {canDeleteReply && (
                      <button
                        type="button"
                        onClick={() => handleDeleteReply(reply.id)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-zinc-300">{reply.content}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h3 className="mb-3 font-display text-base text-zinc-200">Responder</h3>
        <form onSubmit={handleReply}>
          <textarea
            required
            rows={4}
            maxLength={3000}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="input-field resize-y"
            placeholder="Escreva sua resposta ou tire a dúvida do autor..."
          />
          <p className="mt-1 text-xs text-zinc-500">{replyText.length}/3000</p>
          <button type="submit" disabled={submittingReply} className="btn-primary mt-3">
            {submittingReply ? 'Enviando...' : '📨 Publicar resposta'}
          </button>
        </form>
      </section>

      <EditPostModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        post={post}
        onSaved={loadPost}
      />
    </div>
  );
}
