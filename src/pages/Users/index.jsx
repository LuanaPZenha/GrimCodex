import { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import PlatformPicker from '../../components/PlatformPicker';
import { PlatformBadge } from '../../components/PlatformIcon';
import { useToast } from '../../context/ToastContext';
import { usersService } from '../../services/resources';
import { getErrorMessage } from '../../services/api';
import { normalizeUser, toUserPayload, unwrapList, formatRole } from '../../utils/normalize';
import { DIABLO_CLASSES } from '../../utils/registerGuide';

const EMPTY_FORM = {
  name: '',
  username: '',
  email: '',
  password: '',
  platform: 'PC',
  favoriteClass: 'Nenhuma',
  bio: '',
  role: 'user',
};

const ROLE_OPTIONS = [
  { value: 'user', label: 'Gamer' },
  { value: 'admin', label: 'Crítico / Admin' },
];

export default function UserFormModal({ open, onClose, user, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(user?.id);

  useEffect(() => {
    if (open) {
      setForm(
        user
          ? {
              name: user.name,
              username: user.username || '',
              email: user.email,
              password: '',
              platform: user.platform || 'PC',
              favoriteClass: user.favoriteClass || 'Nenhuma',
              bio: user.bio || '',
              role: user.role || 'user',
            }
          : EMPTY_FORM
      );
      setError('');
    }
  }, [open, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = toUserPayload(form);
      if (isEditing) {
        await usersService.update(user.id, payload);
        toast.success('Usuário atualizado com sucesso.');
      } else {
        await usersService.create(payload);
        toast.success('Usuário criado com sucesso.');
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
      title={isEditing ? 'Editar Gamer / Crítico' : 'Novo Gamer / Crítico'}
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-800 bg-red-950/60 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm text-zinc-300">🧙 Nome</label>
            <input id="name" name="name" required value={form.name} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label htmlFor="username" className="mb-1 block text-sm text-zinc-300">🔑 Login</label>
            <input id="username" name="username" required minLength={2} maxLength={50} value={form.username} onChange={handleChange} className="input-field" placeholder="lilith" />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-zinc-300">📧 E-mail</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="input-field" />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm text-zinc-300">
            🔒 Senha {isEditing && <span className="text-zinc-500">(deixe vazio para manter)</span>}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required={!isEditing}
            minLength={8}
            value={form.password}
            onChange={handleChange}
            className="input-field"
          />
          {!isEditing && (
            <p className="mt-1 text-xs text-zinc-500">
              Mín. 8 caracteres, com maiúscula, minúscula e número.
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
          <label className="mb-2 block text-sm text-zinc-300">Plataforma</label>
          <PlatformPicker
            name="platform"
            value={form.platform}
            onChange={handleChange}
          />
        </div>
          <div>
            <label htmlFor="favoriteClass" className="mb-1 block text-sm text-zinc-300">⚔️ Classe</label>
            <select id="favoriteClass" name="favoriteClass" value={form.favoriteClass} onChange={handleChange} className="input-field">
              {DIABLO_CLASSES.map((c) => (
                <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="mb-1 block text-sm text-zinc-300">📜 Bio</label>
          <textarea id="bio" name="bio" rows={2} value={form.bio} onChange={handleChange} className="input-field resize-none" />
        </div>

        <div>
          <label htmlFor="role" className="mb-1 block text-sm text-zinc-300">Perfil</label>
          <select id="role" name="role" value={form.role} onChange={handleChange} className="input-field">
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function UsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await usersService.list();
      setUsers(unwrapList(data).map(normalizeUser));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Remover "${user.name}" permanentemente?`)) return;

    setDeletingId(user.id);
    try {
      await usersService.remove(user.id);
      toast.success('Usuário removido.');
      await loadUsers();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-red-600">Administração</p>
          <h1 className="font-display text-2xl font-bold text-zinc-100 sm:text-3xl">Gamers & Críticos</h1>
          <p className="mt-1 text-sm text-zinc-400">Gerencie contas de acesso ao Grim Codex.</p>
        </div>
        <button type="button" onClick={handleCreate} className="btn-primary shrink-0">
          + Novo Usuário
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-zinc-500">Carregando usuários...</div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-zinc-500">Nenhum usuário cadastrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-900/50 text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Gamer</th>
                  <th className="px-4 py-3">Login</th>
                  <th className="px-4 py-3">Plataforma</th>
                  <th className="px-4 py-3">Perfil</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-800/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-100">{user.name}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">@{user.username || '—'}</td>
                    <td className="px-4 py-3 text-zinc-400">
                      <PlatformBadge platform={user.platform} size={16} />
                      {user.favoriteClass && (
                        <span className="ml-1 text-xs text-zinc-600">
                          {user.classEmoji} {user.favoriteClass}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-xs ${
                        user.role === 'admin'
                          ? 'border-amber-700 text-amber-500'
                          : 'border-zinc-700 text-zinc-400'
                      }`}>
                        {formatRole(user.role)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => handleEdit(user)} className="btn-secondary px-3 py-1.5 text-xs">
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          disabled={deletingId === user.id}
                          className="btn-danger px-3 py-1.5 text-xs"
                        >
                          {deletingId === user.id ? '...' : 'Excluir'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectedUser}
        onSaved={loadUsers}
      />
    </div>
  );
}
