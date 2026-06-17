import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlatformBadge } from './PlatformIcon';
import { IMAGES, NAV_ICONS } from '../utils/diabloTheme';

const navItems = [
  { to: '/dashboard', label: 'Início', icon: NAV_ICONS.dashboard },
  { to: '/items', label: 'Conquistas', icon: NAV_ICONS.items },
  { to: '/mounts', label: 'Montarias', icon: NAV_ICONS.mounts },
  { to: '/forum', label: 'Fórum', icon: NAV_ICONS.forum },
  { to: '/players', label: 'Jogadores', icon: NAV_ICONS.players },
  { to: '/users', label: 'Gamers', icon: NAV_ICONS.users, adminOnly: true },
];

function NavContent({ onNavigate }) {
  const { user, logout } = useAuth();
  const isAdmin = String(user?.role || '').toLowerCase() === 'admin';
  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <>
      <div className="relative overflow-hidden border-b border-zinc-800 p-6">
        <img
          src={IMAGES.cardBanner}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950" />
        <div className="relative flex items-center gap-3">
          <img src={IMAGES.flameIcon} alt="" className="h-10 w-10 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="font-display text-xs tracking-[0.3em] text-red-600">DIABLO IV</p>
            <h1 className="diablo-title text-lg font-bold text-amber-500">Grim Codex</h1>
          </div>
        </div>
        <p className="relative mt-3 truncate text-xs text-zinc-500">
          🧙 {user?.name || user?.email || 'Viajante'}
        </p>
        {user?.username && (
          <Link
            to={`/players/${user.username}`}
            className="relative mt-1 flex items-center gap-1 truncate text-xs text-zinc-600 hover:text-amber-500"
          >
            <span>@{user.username}</span>
            {user.platform && <PlatformBadge platform={user.platform} showLabel size={14} className="text-zinc-600" />}
          </Link>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'border border-red-800/50 bg-red-950/40 text-amber-500 shadow-glow'
                  : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100'
              }`
            }
          >
            <span className="text-lg" aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <button type="button" onClick={logout} className="btn-secondary flex w-full items-center justify-center gap-2 text-sm">
          <span aria-hidden="true">{NAV_ICONS.logout}</span>
          Sair do Santuário
        </button>
      </div>
    </>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-label="Fechar menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-800 bg-zinc-950 transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavContent onNavigate={onClose} />
      </aside>
    </>
  );
}

export function TopNavbar({ onMenuToggle }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 py-3 backdrop-blur-md lg:hidden">
      <button
        type="button"
        onClick={onMenuToggle}
        className="rounded-lg border border-zinc-700 p-2 text-lg text-zinc-300 hover:border-red-700"
        aria-label="Abrir menu"
      >
        ☰
      </button>
      <div className="flex items-center gap-2 text-center">
        <img src={IMAGES.flameIcon} alt="" className="h-7 w-7" aria-hidden="true" />
        <div>
          <p className="font-display text-xs tracking-[0.2em] text-red-600">DIABLO IV</p>
          <p className="diablo-title font-display text-sm font-semibold text-amber-500">Grim Codex</p>
        </div>
      </div>
      <div className="w-9" />
    </header>
  );
}
