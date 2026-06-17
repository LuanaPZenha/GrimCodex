import { getStatusEmoji } from '../utils/diabloTheme';

const STATUS_CONFIG = {
  CONCLUIDO: {
    label: 'Concluído',
    className: 'border-green-700 bg-green-950/60 text-green-400',
  },
  ZERADO: {
    label: 'Zerado',
    className: 'border-green-700 bg-green-950/60 text-green-400',
  },
  EM_ANDAMENTO: {
    label: 'Em Andamento',
    className: 'border-amber-700/50 bg-amber-950/50 text-amber-400',
  },
  JOGANDO: {
    label: 'Jogando',
    className: 'border-amber-700/50 bg-amber-950/50 text-amber-400',
  },
  TENTANDO: {
    label: 'Tentando',
    className: 'border-amber-700/50 bg-amber-950/50 text-amber-400',
  },
  NA_FILA: {
    label: 'Na Fila',
    className: 'border-zinc-600 bg-zinc-800/80 text-zinc-300',
  },
};

function normalizeStatus(status) {
  if (!status) return 'NA_FILA';
  return String(status).toUpperCase().replace(/\s+/g, '_');
}

export function getStatusLabel(status) {
  const key = normalizeStatus(status);
  return STATUS_CONFIG[key]?.label || status;
}

export default function StatusBadge({ status }) {
  const key = normalizeStatus(status);
  const config = STATUS_CONFIG[key] || STATUS_CONFIG.NA_FILA;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${config.className}`}>
      <span aria-hidden="true">{getStatusEmoji(key)}</span>
      {config.label}
    </span>
  );
}

export const STATUS_OPTIONS = [
  { value: 'CONCLUIDO', label: 'Concluído / Zerado' },
  { value: 'EM_ANDAMENTO', label: 'Em Andamento / Tentando' },
  { value: 'NA_FILA', label: 'Na Fila' },
];
