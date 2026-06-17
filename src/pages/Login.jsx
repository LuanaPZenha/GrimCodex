import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import { IMAGES, NAV_ICONS } from '../utils/diabloTheme';

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(identifier, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 p-4">
      <img
        src={IMAGES.loginHero}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/70 to-zinc-950" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(127,29,29,0.35)_0%,_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.12),transparent_45%)]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-red-800/60 bg-zinc-950/80 shadow-glow backdrop-blur-sm">
            <img src={IMAGES.skullEmblem} alt="" className="h-12 w-12" aria-hidden="true" />
          </div>
          <p className="font-display text-xs tracking-[0.4em] text-red-600">🔥 SANCTUARY ARCHIVE</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-amber-500 sm:text-4xl">Grim Codex</h1>
          <p className="mt-2 text-sm text-zinc-400">👹 Guia de Conquistas & Reviews — Diablo IV</p>
        </div>

        <form onSubmit={handleSubmit} className="card border-red-900/30 p-8 backdrop-blur-md">
          <h2 className="mb-6 flex items-center gap-2 font-display text-xl text-zinc-100">
            <span aria-hidden="true">{NAV_ICONS.login}</span>
            Entrar no Santuário
          </h2>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-800 bg-red-950/60 px-4 py-3 text-sm text-red-300" role="alert">
              <span aria-hidden="true">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="identifier" className="mb-1 flex items-center gap-1.5 text-sm font-medium text-zinc-300">
                <span aria-hidden="true">🔑</span> Login
              </label>
              <input
                id="identifier"
                type="text"
                required
                minLength={2}
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="input-field"
                placeholder="seu login (ex: lilith, admin)"
              />
              <p className="mt-1 text-xs text-zinc-500">Use o login cadastrado (nome), não o e-mail — ex: lilith, admin</p>
            </div>

            <div>
              <label htmlFor="password" className="mb-1 flex items-center gap-1.5 text-sm font-medium text-zinc-300">
                <span aria-hidden="true">🔒</span> Senha
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full py-2.5">
            {submitting ? '⏳ Invocando sessão...' : `${NAV_ICONS.login} Acessar Grim Codex`}
          </button>

          <p className="mt-4 text-center text-sm text-zinc-500">
            Novo no Santuário?{' '}
            <Link to="/cadastro" className="font-medium text-amber-500 hover:text-amber-400">
              📝 Criar conta — ver guia de cadastro
            </Link>
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-600">
          🩸 Dark fantasy • 🏆 45 conquistas • 📖 Guias completos
        </p>
      </div>
    </div>
  );
}
