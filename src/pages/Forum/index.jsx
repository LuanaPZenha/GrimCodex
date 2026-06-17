import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PlayerLink from '../../components/PlayerLink';
import Modal from '../../components/Modal';
import ForumChat from '../../components/ForumChat';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { postsService } from '../../services/resources';
import { getErrorMessage } from '../../services/api';
import { normalizePost, toPostPayload, unwrapList } from '../../utils/normalize';
import { FORUM_CATEGORIES, formatForumDate, getForumCategory } from '../../utils/diabloTheme';

const CATEGORY_OPTIONS = Object.keys(FORUM_CATEGORIES);

const EMPTY_FORM = {
  title: '',
  content: '',
  category: 'DUVIDAS',
};

function PostFormModal({ open, onClose, post, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(post?.id);

  useEffect(() => {
    if (open) {
      setForm(
        post
          ? { title: post.title, content: post.content, category: post.category }
          : EMPTY_FORM
      );
      setError('');
    }
  }, [open, post]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = toPostPayload(form);
      if (isEditing) {
        await postsService.update(post.id, payload);
        toast.success('Tópico atualizado.');
      } else {
        await postsService.create(payload);
        toast.success('Tópico publicado no fórum!');
      }
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? '✏️ Editar tópico' : '💬 Nova postagem'}
      size="lg"
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-800 bg-red-950/60 px-4 py-3 text-sm text-red-300" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-zinc-300">
            Título
          </label>
          <input
            id="title"
            name="title"
            required
            maxLength={200}
            value={form.title}
            onChange={handleChange}
            className="input-field"
            placeholder="Ex: Como farmar essência sombria no S5?"
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-zinc-300">
            Categoria
          </label>
          <select id="category" name="category" value={form.category} onChange={handleChange} className="input-field">
            {CATEGORY_OPTIONS.map((key) => (
              <option key={key} value={key}>
                {FORUM_CATEGORIES[key].emoji} {FORUM_CATEGORIES[key].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="content" className="mb-1 block text-sm font-medium text-zinc-300">
            Conteúdo
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={8}
            maxLength={5000}
            value={form.content}
            onChange={handleChange}
            className="input-field resize-y"
            placeholder="Descreva sua dúvida, build ou experiência..."
          />
          <p className="mt-1 text-xs text-zinc-500">{form.content.length}/5000</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Publicando...' : isEditing ? 'Salvar' : 'Publicar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function PostCard({ post, onEdit }) {
  const category = getForumCategory(post.category);

  return (
    <article className="group rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:border-red-800/40 hover:shadow-glow">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${category.color}`}>
          {category.emoji} {category.label}
        </span>
        <span className="text-xs text-zinc-500">{formatForumDate(post.createdAt)}</span>
      </div>

      <Link to={`/forum/${post.id}`} className="block">
        <h3 className="font-display text-lg text-zinc-100 transition group-hover:text-amber-500">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{post.content}</p>
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 pt-3 text-xs text-zinc-500">
        <span>
          🧙 <PlayerLink username={post.authorUsername} /> · {post.authorName}
        </span>
        <div className="flex items-center gap-3">
          <span>💬 {post.replyCount} {post.replyCount === 1 ? 'resposta' : 'respostas'}</span>
          {onEdit && (
            <button type="button" onClick={() => onEdit(post)} className="text-amber-500 hover:text-amber-400">
              ✏️ Editar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ForumPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('topics');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter) params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();
      const data = await postsService.list(params);
      setPosts(unwrapList(data).map(normalizePost));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [categoryFilter]);

  const handleSearch = (event) => {
    event.preventDefault();
    loadPosts();
  };

  const openCreate = () => {
    setEditingPost(null);
    setModalOpen(true);
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setModalOpen(true);
  };

  const filteredCount = useMemo(() => posts.length, [posts]);
  const isAdmin = String(user?.role || '').toLowerCase() === 'admin';

  const canEditPost = (post) => isAdmin || user?.id === post.authorId;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-red-600">💬 Comunidade Sanctuary</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-zinc-100 sm:text-3xl">Fórum dos Nephalem</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Tire dúvidas, compartilhe builds e converse ao vivo com outros jogadores.
          </p>
        </div>
        {activeTab === 'topics' && (
          <button type="button" onClick={openCreate} className="btn-primary shrink-0 px-5 py-2.5">
            ✍️ Nova postagem
          </button>
        )}
      </div>

      <div className="mb-6 flex gap-2 border-b border-zinc-800 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('topics')}
          className={`rounded-t-lg px-4 py-2.5 text-sm font-medium transition ${
            activeTab === 'topics'
              ? 'border border-b-0 border-zinc-700 bg-zinc-900/80 text-amber-500'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          📋 Tópicos
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`rounded-t-lg px-4 py-2.5 text-sm font-medium transition ${
            activeTab === 'chat'
              ? 'border border-b-0 border-zinc-700 bg-zinc-900/80 text-amber-500'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          🔴 Chat ao vivo
        </button>
      </div>

      {activeTab === 'chat' ? (
        <ForumChat />
      ) : (
        <>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoryFilter('')}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              !categoryFilter
                ? 'border-red-700 bg-red-950/50 text-amber-500'
                : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
            }`}
          >
            Todos
          </button>
          {CATEGORY_OPTIONS.map((key) => {
            const cat = FORUM_CATEGORIES[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setCategoryFilter(key)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  categoryFilter === key
                    ? 'border-red-700 bg-red-950/50 text-amber-500'
                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar tópicos..."
            className="input-field min-w-[200px] py-2 text-sm"
          />
          <button type="submit" className="btn-secondary px-4 py-2 text-sm">
            🔍
          </button>
        </form>
      </div>

      {loading ? (
        <div className="py-16 text-center text-zinc-500">⏳ Carregando tópicos...</div>
      ) : filteredCount === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 py-16 text-center">
          <p className="text-4xl" aria-hidden="true">💬</p>
          <p className="mt-3 font-display text-lg text-zinc-300">Nenhum tópico ainda</p>
          <p className="mt-1 text-sm text-zinc-500">Seja o primeiro a iniciar uma discussão!</p>
          <button type="button" onClick={openCreate} className="btn-primary mt-6">
            Criar primeira postagem
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={canEditPost(post) ? openEdit : null}
            />
          ))}
        </div>
      )}

      <PostFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        post={editingPost}
        onSaved={loadPosts}
      />
        </>
      )}
    </div>
  );
}
