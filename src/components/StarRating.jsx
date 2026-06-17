export default function StarRating({ value = 0, max = 5, size = 'sm', interactive = false, onChange }) {
  const sizeClass = size === 'lg' ? 'text-xl' : 'text-sm';

  return (
    <div className={`flex gap-0.5 ${sizeClass}`} role={interactive ? 'radiogroup' : 'img'} aria-label={`Nota ${value} de ${max}`}>
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const filled = starValue <= value;

        if (interactive) {
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => onChange?.(starValue)}
              className={`transition hover:scale-110 ${filled ? 'text-amber-500' : 'text-zinc-600 hover:text-amber-400'}`}
              aria-label={`${starValue} estrela${starValue > 1 ? 's' : ''}`}
            >
              ★
            </button>
          );
        }

        return (
          <span key={starValue} className={filled ? 'text-amber-500' : 'text-zinc-600'}>
            ★
          </span>
        );
      })}
    </div>
  );
}
