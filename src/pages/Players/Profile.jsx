import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StatsEditModal from '../../components/StatsEditModal';
import { PlatformBadge } from '../../components/PlatformIcon';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { profilesService } from '../../services/resources';
import { getErrorMessage } from '../../services/api';
import { normalizeProfile, toStatsPayload } from '../../utils/normalize';
import { IMAGES, PLAYER_STATS } from '../../utils/diabloTheme';
import { DIABLO_CLASSES } from '../../utils/registerGuide';

function getClassLabel(value) {
  const found = DIABLO_CLASSES.find((c) => c.value === value);
  return found ? found.label : value || '—';
}

function StatCard({ stat, profile }) {
  const value = profile[stat.key];
  const displayValue = stat.isClass
    ? `${profile.mostUsedClassEmoji || '⚔️'} ${getClassLabel(value)}`
    : `${value}${stat.suffix || ''}`;

  const progress = stat.max && !stat.isClass
    ? Math.min(100, Math.round((Number(value) / stat.max) * 100))
    : null;

  return (
    <div className={`relative overflow-hidden rounded-xl border ${stat.border} bg-gradient-to-br ${stat.gradient} p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500">{stat.emoji} {stat.label}</p>
          <p className={`mt-2 font-display text-2xl font-bold sm:text-3xl ${stat.accent}`}>
            {displayValue}
          </p>
        </div>
        <span className="text-3xl opacity-60" aria-hidden="true">{stat.emoji}</span>
      </div>

      {progress !== null && (
        <div className="mt-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-700 to-amber-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-right text-[10px] text-zinc-600">{progress}% do máximo</p>
        </div>
      )}
    </div>
  );
}

export default function PlayerProfilePage() {
  const { username } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isOwnProfile = user?.id === profile?.id;

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await profilesService.getByUsername(username);
      setProfile(normalizeProfile(data));
    } catch (err) {
      toast.error(getErrorMessage(err));
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [username]);

  const handleSaveStats = async (form) => {
    setSubmitting(true);
    setError('');
    try {
      const updated = await profilesService.updateStats(toStatsPayload(form));
      setProfile(normalizeProfile(updated));
      toast.success('Estatísticas atualizadas!');
      setEditOpen(false);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-zinc-500">⏳ Carregando perfil...</div>;
  }

  if (!profile) {
    return (
      <div className="py-16 text-center">
        <p className="text-zinc-400">Jogador não encontrado.</p>
        <Link to="/players" className="mt-4 inline-block text-amber-500 hover:underline">
          ← Voltar aos jogadores
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/players" className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-amber-500">
        ← Todos os jogadores
      </Link>

      {/* Hero */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-red-900/40">
        <img src={IMAGES.loginHero} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/60" />
        <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-red-800/60 bg-zinc-950/80 text-5xl shadow-glow">
            {profile.mostUsedClassEmoji || profile.classEmoji || '🧙'}
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-red-600">
              {profile.role === 'admin' ? '🛡️ Administrador' : '⚔️ Nephalem'}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-zinc-100 sm:text-4xl">{profile.name}</h1>
            <p className="mt-1 text-lg text-amber-500">@{profile.username}</p>
            <p className="mt-2 text-sm text-zinc-400">
              <PlatformBadge platform={profile.platform} size={18} />
              {profile.favoriteClass && profile.favoriteClass !== 'Nenhuma' && (
                <> · Favorita: {profile.classEmoji} {profile.favoriteClass}</>
              )}
            </p>
            {profile.bio && (
              <p className="mt-3 max-w-xl text-sm italic text-zinc-500">"{profile.bio}"</p>
            )}
          </div>
          {isOwnProfile && (
            <button type="button" onClick={() => setEditOpen(true)} className="btn-primary shrink-0 self-start">
              📊 Editar estatísticas
            </button>
          )}
        </div>
      </div>

      {/* Stats dashboard */}
      <section>
        <div className="mb-5 flex items-center gap-2">
          <h2 className="font-display text-xl text-amber-500">📊 Estatísticas Pessoais</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-red-900/50 to-transparent" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLAYER_STATS.map((stat) => (
            <StatCard key={stat.key} stat={stat} profile={profile} />
          ))}
        </div>

        {/* Summary row */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="font-display text-sm text-zinc-400">Progresso de conquistas</h3>
            <div className="mt-3 flex items-end gap-2">
              <span className="font-display text-4xl font-bold text-amber-500">{profile.achievementsCompleted}</span>
              <span className="mb-1 text-zinc-500">/ 45 no Grim Codex</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-700 to-amber-500"
                style={{ width: `${Math.min(100, Math.round((profile.achievementsCompleted / 45) * 100))}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="font-display text-sm text-zinc-400">Veteranía no Santuário</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              <li>🌙 {profile.seasonsCompleted} temporadas completas</li>
              <li>👹 {profile.bossesDefeated} chefes derrotados</li>
              <li>⏱️ {profile.hoursPlayed} horas de jornada</li>
              <li>⚔️ Main: {getClassLabel(profile.mostUsedClass)}</li>
            </ul>
          </div>
        </div>
      </section>

      <StatsEditModal
        open={editOpen}
        onClose={() => { setEditOpen(false); setError(''); }}
        profile={profile}
        submitting={submitting}
        error={error}
        onSubmit={handleSaveStats}
      />
    </div>
  );
}
