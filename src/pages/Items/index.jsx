import { useEffect, useMemo, useState } from 'react';
import Modal from '../../components/Modal';
import ItemGuideModal from '../../components/ItemGuideModal';
import ItemCard from '../../components/ItemCard';
import StarRating from '../../components/StarRating';
import StatusBadge, { STATUS_OPTIONS } from '../../components/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { itemsService } from '../../services/resources';
import { getErrorMessage } from '../../services/api';
import { normalizeItem, toItemPayload, unwrapList } from '../../utils/normalize';
import { ACHIEVEMENT_CATEGORY_OPTIONS, ACHIEVEMENT_CATEGORY_ORDER, getCategoryTheme, RARITY_OPTIONS, isHuntRarity } from '../../utils/diabloTheme';

const EMPTY_FORM = {
  title: '',
  category: 'Endgame',
  rating: 3,
  rarity: 'RARA',
  status: 'NA_FILA',
  description: '',
  guide: '',
  howTo: '',
  averageTime: '',
  location: '',
  guideType: 'CONQUISTA',
};

export default function ItemFormModal({ open, onClose, item, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(item?.id);

  useEffect(() => {
    if (open) {
      setForm(
        item
          ? {
              title: item.title,
              category: item.category,
              rating: item.rating,
              rarity: item.rarity || 'COMUM',
              status: item.status,
              description: item.description,
              guide: item.guide || '',
              howTo: item.howTo || '',
              averageTime: item.averageTime || '',
              location: item.location || '',
              guideType: 'CONQUISTA',
            }
          : EMPTY_FORM
      );
      setError('');
    }
  }, [open, item]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = toItemPayload(form);
      if (isEditing) {
        await itemsService.update(item.id, payload);
        toast.success('Conquista atualizada com sucesso.');
      } else {
        await itemsService.create(payload);
        toast.success('Conquista cadastrada com sucesso.');
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
      title={isEditing ? 'Editar Conquista' : 'Nova Conquista'}
      size="lg"
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-800 bg-red-950/60 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm text-zinc-300">Título do Desafio</label>
          <input
            id="title"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="input-field"
            placeholder="Eco de Lilith"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="mb-1 block text-sm text-zinc-300">Tipo de conteúdo</label>
            <select id="category" name="category" value={form.category} onChange={handleChange} className="input-field">
              {ACHIEVEMENT_CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.emoji} {cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="rarity" className="mb-1 block text-sm text-zinc-300">Selo de Raridade</label>
            <select id="rarity" name="rarity" value={form.rarity} onChange={handleChange} className="input-field">
              {RARITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.emoji} {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="status" className="mb-1 block text-sm text-zinc-300">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange} className="input-field">
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">Nota / Dificuldade (1–5)</label>
          <StarRating
            value={form.rating}
            interactive
            size="lg"
            onChange={(rating) => setForm((prev) => ({ ...prev, rating }))}
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm text-zinc-300">Descrição do Objetivo</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            required
            value={form.description}
            onChange={handleChange}
            className="input-field resize-none"
            placeholder="Derrotar Lilith no modo Tormento e registrar build utilizada..."
          />
        </div>

        <div>
          <label htmlFor="howTo" className="mb-1 block text-sm text-zinc-300">Como fazer</label>
          <textarea
            id="howTo"
            name="howTo"
            rows={3}
            value={form.howTo}
            onChange={handleChange}
            className="input-field resize-none"
            placeholder="Passo a passo resumido da conquista..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="averageTime" className="mb-1 block text-sm text-zinc-300">Tempo médio</label>
            <input
              id="averageTime"
              name="averageTime"
              value={form.averageTime}
              onChange={handleChange}
              className="input-field"
              placeholder="~2–5 horas"
            />
          </div>
          <div>
            <label htmlFor="location" className="mb-1 block text-sm text-zinc-300">Localização</label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="input-field"
              placeholder="Nahantu, Helltides..."
            />
          </div>
        </div>

        <div>
          <label htmlFor="guide" className="mb-1 block text-sm text-zinc-300">Guia Completo (detalhes extras)</label>
          <textarea
            id="guide"
            name="guide"
            rows={8}
            value={form.guide}
            onChange={handleChange}
            className="input-field resize-none font-mono text-xs"
            placeholder="Passo a passo, dicas, regiões recomendadas..."
          />
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

export function ItemsPage() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [guideItem, setGuideItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [rarityFilter, setRarityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await itemsService.list({ guideType: 'CONQUISTA' });
      setItems(unwrapList(data).map(normalizeItem));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    let result = items;

    if (statusFilter !== 'ALL') {
      result = result.filter((item) => String(item.status).toUpperCase().includes(statusFilter));
    }

    if (rarityFilter === 'HUNT') {
      result = result.filter((item) => isHuntRarity(item.rarity));
    } else if (rarityFilter !== 'ALL') {
      result = result.filter((item) => item.rarity === rarityFilter);
    }

    if (categoryFilter !== 'ALL') {
      result = result.filter((item) => item.category === categoryFilter);
    }

    return result;
  }, [items, statusFilter, rarityFilter, categoryFilter]);

  const groupedItems = useMemo(() => {
    if (categoryFilter !== 'ALL') return null;

    const groups = {};
    filteredItems.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });

    return ACHIEVEMENT_CATEGORY_ORDER
      .filter((cat) => groups[cat]?.length)
      .map((cat) => ({
        category: cat,
        theme: getCategoryTheme(cat),
        items: groups[cat],
      }));
  }, [filteredItems, categoryFilter]);

  const categoryStats = useMemo(() => {
    const counts = {};
    items.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  const huntStats = useMemo(() => {
    const huntItems = items.filter((i) => isHuntRarity(i.rarity));
    const hunted = huntItems.filter((i) => i.status === 'CONCLUIDO').length;
    return { total: huntItems.length, hunted };
  }, [items]);

  const handleCreate = () => {
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleViewGuide = (item) => {
    setGuideItem(item);
    setGuideOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Excluir a conquista "${item.title}"?`)) return;

    setDeletingId(item.id);
    try {
      await itemsService.remove(item.id);
      toast.success('Conquista removida.');
      await loadItems();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-red-600">📚 Biblioteca do Santuário</p>
          <h1 className="font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
            🏆 Conquistas & Desafios
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {items.length} conquistas no grimório — {huntStats.hunted}/{huntStats.total} raras caçadas.
          </p>
        </div>
        <button type="button" onClick={handleCreate} className="btn-primary shrink-0">
          ➕ Nova Conquista
        </button>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-xs uppercase tracking-widest text-zinc-500">📂 Tipo de conteúdo</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoryFilter('ALL')}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              categoryFilter === 'ALL'
                ? 'border-red-700 bg-red-950/40 text-amber-500'
                : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
            }`}
          >
            🌐 Todas ({items.length})
          </button>
          {ACHIEVEMENT_CATEGORY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setCategoryFilter(option.value)}
              className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                categoryFilter === option.value
                  ? 'border-red-700 bg-red-950/40 text-amber-500'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              {option.emoji} {option.label.split(' — ')[0]}
              {categoryStats[option.value] ? ` (${categoryStats[option.value]})` : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { value: 'ALL', label: 'Todas', emoji: '🌐' },
          { value: 'CONCLUIDO', label: 'Concluídas', emoji: '✅' },
          { value: 'EM_ANDAMENTO', label: 'Em Andamento', emoji: '⚔️' },
          { value: 'NA_FILA', label: 'Na Fila', emoji: '⏳' },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setStatusFilter(option.value)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
              statusFilter === option.value
                ? 'border-red-700 bg-red-950/40 text-amber-500'
                : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
            }`}
          >
            <span aria-hidden="true">{option.emoji}</span>
            {option.label}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <p className="mb-2 text-xs uppercase tracking-widest text-zinc-500">🎯 Caçar por raridade</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setRarityFilter('HUNT')}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              rarityFilter === 'HUNT'
                ? 'border-amber-600 bg-amber-950/50 text-amber-400 shadow-glow'
                : 'border-amber-900/40 text-amber-600/80 hover:border-amber-700'
            }`}
          >
            🎯 Caçar Raras+
          </button>
          <button
            type="button"
            onClick={() => setRarityFilter('ALL')}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              rarityFilter === 'ALL'
                ? 'border-red-700 bg-red-950/40 text-amber-500'
                : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
            }`}
          >
            Todas raridades
          </button>
          {RARITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRarityFilter(option.value)}
              className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                rarityFilter === option.value
                  ? `${option.border} ${option.bg} ${option.text}`
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              {option.emoji} {option.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-zinc-500">
          <span className="mb-3 block text-4xl" aria-hidden="true">🔮</span>
          Invocando conquistas...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="card py-24 text-center text-zinc-500">
          <span className="mb-3 block text-4xl" aria-hidden="true">👹</span>
          Nenhuma conquista encontrada. Registre seu primeiro desafio!
        </div>
      ) : groupedItems ? (
        <div className="space-y-10">
          {groupedItems.map(({ category, theme, items: groupItems }) => (
            <section key={category}>
              <div className="mb-4 flex items-center gap-3 border-b border-zinc-800 pb-3">
                <span className="text-2xl" aria-hidden="true">{theme.emoji}</span>
                <div>
                  <h2 className="font-display text-lg text-amber-500">{theme.label}</h2>
                  <p className="text-xs text-zinc-500">{groupItems.length} conquistas</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {groupItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onViewGuide={handleViewGuide}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    deleting={deletingId === item.id}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onViewGuide={handleViewGuide}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deleting={deletingId === item.id}
            />
          ))}
        </div>
      )}

      <ItemFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={selectedItem}
        onSaved={loadItems}
      />

      <ItemGuideModal
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        item={guideItem}
      />
    </div>
  );
}
