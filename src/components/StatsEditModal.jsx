import { useEffect, useState } from 'react';
import Modal from './Modal';
import { DIABLO_CLASSES } from '../utils/registerGuide';

const EMPTY_STATS = {
  hoursPlayed: 0,
  achievementsCompleted: 0,
  mostUsedClass: 'Nenhuma',
  seasonsCompleted: 0,
  bossesDefeated: 0,
};

export default function StatsEditModal({ open, onClose, profile, onSaved, submitting, error, onSubmit }) {
  const [form, setForm] = useState(EMPTY_STATS);

  useEffect(() => {
    if (open && profile) {
      setForm({
        hoursPlayed: profile.hoursPlayed ?? 0,
        achievementsCompleted: profile.achievementsCompleted ?? 0,
        mostUsedClass: profile.mostUsedClass || profile.favoriteClass || 'Nenhuma',
        seasonsCompleted: profile.seasonsCompleted ?? 0,
        bossesDefeated: profile.bossesDefeated ?? 0,
      });
    }
  }, [open, profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  if (!profile) return null;

  return (
    <Modal open={open} onClose={onClose} title="📊 Atualizar estatísticas" size="lg">
      {error && (
        <div className="mb-4 rounded-lg border border-red-800 bg-red-950/60 px-4 py-3 text-sm text-red-300">{error}</div>
      )}

      <p className="mb-4 text-sm text-zinc-400">
        Atualize seu progresso no Santuário. Outros jogadores verão essas estatísticas no seu perfil.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="hoursPlayed" className="mb-1 block text-sm text-zinc-300">⏱️ Horas jogadas</label>
          <input id="hoursPlayed" name="hoursPlayed" type="number" min={0} max={99999} value={form.hoursPlayed} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label htmlFor="achievementsCompleted" className="mb-1 block text-sm text-zinc-300">🏆 Conquistas concluídas</label>
          <input id="achievementsCompleted" name="achievementsCompleted" type="number" min={0} max={45} value={form.achievementsCompleted} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label htmlFor="mostUsedClass" className="mb-1 block text-sm text-zinc-300">⚔️ Classe mais usada</label>
          <select id="mostUsedClass" name="mostUsedClass" value={form.mostUsedClass} onChange={handleChange} className="input-field">
            {DIABLO_CLASSES.map((c) => (
              <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="seasonsCompleted" className="mb-1 block text-sm text-zinc-300">🌙 Temporadas concluídas</label>
          <input id="seasonsCompleted" name="seasonsCompleted" type="number" min={0} max={99} value={form.seasonsCompleted} onChange={handleChange} className="input-field" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="bossesDefeated" className="mb-1 block text-sm text-zinc-300">👹 Chefes derrotados</label>
          <input id="bossesDefeated" name="bossesDefeated" type="number" min={0} max={9999} value={form.bossesDefeated} onChange={handleChange} className="input-field" />
        </div>

        <div className="flex justify-end gap-3 sm:col-span-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Salvando...' : 'Salvar estatísticas'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
