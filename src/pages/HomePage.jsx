import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlatformBadge } from '../components/PlatformIcon';
import { IMAGES } from '../utils/diabloTheme';

export default function HomePage() {
  const { user } = useAuth();
  const displayName = user?.name || user?.nome || user?.email || 'Viajante';
  const isAdmin = String(user?.role || '').toLowerCase() === 'admin';

  return (
    <div>
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-red-900/30 p-6 sm:p-8">
        <img
          src={IMAGES.loginHero}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/60" />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-red-600">🔥 Bem-vindo de volta ao Santuário</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
            Olá, <span className="text-amber-500">{displayName}</span> 🧙
          </h1>
          <p className="mt-2 flex max-w-2xl flex-wrap items-center gap-x-2 gap-y-1 text-zinc-400">
            <PlatformBadge platform={user?.platform || 'PC'} size={18} />
            {user?.favoriteClass && user.favoriteClass !== 'Nenhuma' && (
              <> • {user?.classEmoji} {user.favoriteClass}</>
            )}
            {' '}— registre conquistas e consulte guias do Endgame.
          </p>
        </div>
      </div>

      <div className={`grid gap-4 sm:grid-cols-2 ${isAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-3'}`}>
        <Link
          to="/items"
          className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 transition hover:border-red-700/50 hover:shadow-glow"
        >
          <img
            src={IMAGES.cardBanner}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-20 transition group-hover:opacity-30"
          />
          <div className="relative">
            <span className="text-4xl" aria-hidden="true">🏆</span>
            <h2 className="mt-3 font-display text-lg text-zinc-100 group-hover:text-amber-500">
              Conquistas & Desafios
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              📖 45 guias • 🎮 Grid estilo Steam • ⭐ Notas e status
            </p>
          </div>
        </Link>

        <Link
          to="/mounts"
          className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 transition hover:border-red-700/50 hover:shadow-glow"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-950/30 to-zinc-950 opacity-80" />
          <div className="relative">
            <span className="text-4xl" aria-hidden="true">🐎</span>
            <h2 className="mt-3 font-display text-lg text-zinc-100 group-hover:text-amber-500">
              Guia de Montarias
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              🏇 19 montarias • 📍 Como desbloquear • ⭐ Raridade
            </p>
          </div>
        </Link>

        <Link
          to="/forum"
          className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 transition hover:border-red-700/50 hover:shadow-glow"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 to-zinc-950 opacity-80" />
          <div className="relative">
            <span className="text-4xl" aria-hidden="true">💬</span>
            <h2 className="mt-3 font-display text-lg text-zinc-100 group-hover:text-amber-500">
              Fórum dos Nephalem
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              ❓ Dúvidas • ⚔️ Builds • 🔴 Chat ao vivo
            </p>
          </div>
        </Link>

        <Link
          to="/players"
          className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 transition hover:border-red-700/50 hover:shadow-glow"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 to-zinc-950 opacity-80" />
          <div className="relative">
            <span className="text-4xl" aria-hidden="true">🧙</span>
            <h2 className="mt-3 font-display text-lg text-zinc-100 group-hover:text-amber-500">
              Perfis de Jogadores
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              📊 Stats • 🏆 Conquistas • ⏱️ Horas jogadas
            </p>
          </div>
        </Link>

        {isAdmin && (
          <Link
            to="/users"
            className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 transition hover:border-red-700/50 hover:shadow-glow"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-950/20 to-red-950/20 opacity-0 transition group-hover:opacity-100" />
            <div className="relative">
              <span className="text-4xl" aria-hidden="true">👥</span>
              <h2 className="mt-3 font-display text-lg text-zinc-100 group-hover:text-amber-500">
                Gamers & Críticos
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                🛡️ Admin • ✏️ CRUD de usuários • 🔐 Permissões JWT
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
