import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import RegisterGuidePanel from '../components/RegisterGuidePanel';
import { IMAGES, NAV_ICONS } from '../utils/diabloTheme';
import { PLATFORMS, DIABLO_CLASSES } from '../utils/registerGuide';

const EMPTY_FORM = {
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  platform: 'PC',
  favoriteClass: 'Nenhuma',
  bio: '',
};

export default function Register() {
  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [activeField, setActiveField] = useState('name');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: form.name,
        username: form.username,
        login: form.username,
        email: form.email,
        password: form.password,
        platform: form.platform,
        favoriteClass: form.favoriteClass === 'Nenhuma' ? null : form.favoriteClass,
        bio: form.bio || null,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 p-4 sm:p-6 lg:p-8">
      <img
        src={IMAGES.loginHero}
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/85 to-zinc-950" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <img src={IMAGES.flameIcon} alt="" className="mx-auto mb-3 h-12 w-12" aria-hidden="true" />
          <p className="font-display text-xs tracking-[0.4em] text-red-600">NOVO VIAJANTE</p>
          <h1 className="font-display text-3xl font-bold text-amber-500 sm:text-4xl">Cadastro — Grim Codex</h1>
          <p className="mt-2 text-sm text-zinc-400">Crie sua conta de gamer/crítico do Santuário</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <RegisterGuidePanel activeField={activeField} />

          <form onSubmit={handleSubmit} className="card border-red-900/30 p-6 backdrop-blur-md sm:p-8">
            <h2 className="mb-6 flex items-center gap-2 font-display text-xl text-zinc-100">
              <span aria-hidden="true">📝</span> Formulário de Cadastro
            </h2>

            {error && (
              <div className="mb-4 flex gap-2 rounded-lg border border-red-800 bg-red-950/60 px-4 py-3 text-sm text-red-300" role="alert">
                <span aria-hidden="true">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 flex items-center gap-1.5 text-sm text-zinc-300">
                  <span aria-hidden="true">🧙</span> Nome completo *
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setActiveField('name')}
                  className="input-field"
                  placeholder="Seu nome no Santuário"
                />
              </div>

              <div>
                <label htmlFor="username" className="mb-1 flex items-center gap-1.5 text-sm text-zinc-300">
                  <span aria-hidden="true">🔑</span> Login *
                </label>
                <input
                  id="username"
                  name="username"
                  required
                  minLength={2}
                  maxLength={50}
                  value={form.username}
                  onChange={handleChange}
                  onFocus={() => setActiveField('username')}
                  className="input-field"
                  placeholder="lilith"
                />
                <p className="mt-1 text-xs text-zinc-500">Apenas letras (mín. 2). Deve ser único — ex: necro, barbaro</p>
              </div>

              <div>
                <label htmlFor="email" className="mb-1 flex items-center gap-1.5 text-sm text-zinc-300">
                  <span aria-hidden="true">📧</span> E-mail *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setActiveField('email')}
                  className="input-field"
                  placeholder="gamer@sanctuary.net"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="mb-1 flex items-center gap-1.5 text-sm text-zinc-300">
                    <span aria-hidden="true">🔒</span> Senha *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setActiveField('password')}
                    className="input-field"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="mb-1 flex items-center gap-1.5 text-sm text-zinc-300">
                    <span aria-hidden="true">🔐</span> Confirmar senha *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setActiveField('password')}
                    className="input-field"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <p className="text-xs text-zinc-500">8+ chars • maiúscula • minúscula • número</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="platform" className="mb-1 flex items-center gap-1.5 text-sm text-zinc-300">
                    <span aria-hidden="true">🎮</span> Plataforma *
                  </label>
                  <select
                    id="platform"
                    name="platform"
                    required
                    value={form.platform}
                    onChange={handleChange}
                    onFocus={() => setActiveField('platform')}
                    className="input-field"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p.value} value={p.value}>{p.emoji} {p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="favoriteClass" className="mb-1 flex items-center gap-1.5 text-sm text-zinc-300">
                    <span aria-hidden="true">⚔️</span> Classe favorita
                  </label>
                  <select
                    id="favoriteClass"
                    name="favoriteClass"
                    value={form.favoriteClass}
                    onChange={handleChange}
                    onFocus={() => setActiveField('favoriteClass')}
                    className="input-field"
                  >
                    {DIABLO_CLASSES.map((c) => (
                      <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="mb-1 flex items-center gap-1.5 text-sm text-zinc-300">
                  <span aria-hidden="true">📜</span> Bio / Sobre você
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  maxLength={300}
                  value={form.bio}
                  onChange={handleChange}
                  onFocus={() => setActiveField('bio')}
                  className="input-field resize-none"
                  placeholder="Main necro, caçando conquistas de endgame..."
                />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full py-2.5">
              {submitting ? '⏳ Forjando conta...' : `${NAV_ICONS.login} Criar conta no Grim Codex`}
            </button>

            <p className="mt-4 text-center text-sm text-zinc-500">
              Já tem conta?{' '}
              <Link to="/login" className="font-medium text-amber-500 hover:text-amber-400">
                🔮 Entrar no Santuário
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
