import { getRarityTheme } from '../utils/diabloTheme';

export default function RarityBadge({ rarity, size = 'sm', className = '' }) {
  const theme = getRarityTheme(rarity);
  const sizeClass = size === 'lg'
    ? 'px-3 py-1 text-sm'
    : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${theme.border} ${theme.bg} ${theme.text} ${sizeClass} ${className}`}
      title={`Raridade: ${theme.label}`}
    >
      <span aria-hidden="true">{theme.emoji}</span>
      {theme.label}
    </span>
  );
}
