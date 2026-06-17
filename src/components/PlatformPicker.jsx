import PlatformIcon from './PlatformIcon';
import { PLATFORMS } from '../utils/registerGuide';

export default function PlatformPicker({ name, value, onChange, onFocus, required = false }) {
  const handleSelect = (platformValue) => {
    onChange({ target: { name, value: platformValue } });
  };

  return (
    <div
      className="grid grid-cols-2 gap-2 sm:grid-cols-3"
      role="radiogroup"
      aria-label="Plataforma"
      aria-required={required}
    >
      {PLATFORMS.map((platform) => {
        const selected = value === platform.value;
        return (
          <button
            key={platform.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => handleSelect(platform.value)}
            onFocus={onFocus}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
              selected
                ? 'border-amber-600/70 bg-amber-950/30 text-zinc-100 shadow-glow'
                : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
            }`}
          >
            <PlatformIcon platform={platform.value} size={22} />
            <span className="leading-tight">{platform.shortLabel || platform.label}</span>
          </button>
        );
      })}
      <input type="hidden" name={name} value={value} required={required} />
    </div>
  );
}
