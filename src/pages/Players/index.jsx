import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { profilesService } from '../../services/resources';
import { getErrorMessage } from '../../services/api';
import { normalizeProfile, unwrapList } from '../../utils/normalize';
import { useToast } from '../../context/ToastContext';
import { IMAGES } from '../../utils/diabloTheme';

function PlayerCard({ player }) {
  return (
    <Link
      to={`/players/${player.username}`}
      className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:border-red-800/40 hover:shadow-glow"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="relative flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-red-800/50 bg-zinc-950 text-2xl">
          {player.mostUsedClassEmoji || player.classEmoji || '🧙'}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-lg text-zinc-100 group-hover:text-amber-500">
            {player.name}
          </h3>
          <p className="text-sm text-amber-500/80">@{player.username}</p>
          <p className="mt-1 text-xs text-zinc-500">
            {player.platformEmoji} {player.platform}
            {player.mostUsedClass && player.mostUsedClass !== 'Nenhuma' && (
              <> · {player.mostUsedClassEmoji} {player.mostUsedClass}</>
            )}
          </p>
        </div>
      </div>

      <div className="relative mt-4 grid grid-cols-3 gap-2 border-t border-zinc-800 pt-4 text-center text-xs">
        <div>
          <p className="font-display text-base text-amber-500">{player.hoursPlayed}h</p>
          <p className="text-zinc-500">Horas</p>
        </div>
        <div>
          <p className="font-display text-base text-amber-500">{player.achievementsCompleted}</p>
          <p className="text-zinc-500">Conquistas</p>
        </div>
        <div>
          <p className="font-display text-base text-amber-500">{player.bossesDefeated}</p>
          <p className="text-zinc-500">Chefes</p>
        </div>
      </div>
    </Link>
  );
}

export default function PlayersPage() {
  const toast = useToast();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await profilesService.list();
        setPlayers(unwrapList(data).map(normalizeProfile));
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = players.filter((p) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      p.name.toLowerCase().includes(term)
      || p.username.toLowerCase().includes(term)
      || (p.mostUsedClass || '').toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-red-900/30 p-6 sm:p-8">
        <img src={IMAGES.cardBanner} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/70" />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-red-600">🧙 Comunidade Nephalem</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-zinc-100 sm:text-3xl">Jogadores do Santuário</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Explore perfis, estatísticas e progresso de outros viajantes.
          </p>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, login ou classe..."
          className="input-field max-w-md py-2.5 text-sm"
        />
      </div>

      {loading ? (
        <div className="py-16 text-center text-zinc-500">⏳ Carregando jogadores...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 py-16 text-center text-zinc-500">
          Nenhum jogador encontrado.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </div>
  );
}
