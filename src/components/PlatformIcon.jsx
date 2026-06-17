const ICONS = {
  PC: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" fill="currentColor" opacity="0.9" />
      <rect x="5" y="6" width="14" height="8" rx="0.5" fill="#18181b" />
      <path d="M10 19h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 19h8v1.5H8z" fill="currentColor" opacity="0.7" />
    </>
  ),
  Xbox: (
    <>
      <circle cx="12" cy="12" r="11" fill="#107C10" />
      <path
        fill="#fff"
        d="M6.2 6.2 12 11.4l5.8-5.2 1.6 1.4L13.8 12l5.6 5.2-1.6 1.4L12 13.2l-5.8 5.4-1.6-1.4L10.2 12 4.6 7.6l1.6-1.4z"
      />
    </>
  ),
  PS5: (
    <>
      <circle cx="12" cy="12" r="11" fill="#0070CC" />
      <text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" fontFamily="Cinzel, serif">
        PS
      </text>
    </>
  ),
  Switch: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="6" fill="#E60012" />
      <rect x="4" y="8" width="6" height="8" rx="3" fill="#fff" opacity="0.95" />
      <rect x="14" y="8" width="6" height="8" rx="3" fill="#fff" opacity="0.95" />
      <circle cx="7" cy="12" r="1.2" fill="#E60012" />
    </>
  ),
  Multiplataforma: (
    <>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <ellipse cx="12" cy="12" rx="4" ry="10" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      <path d="M2 12h20M4.5 7h15M4.5 17h15" stroke="currentColor" strokeWidth="1" opacity="0.45" />
    </>
  ),
};

export default function PlatformIcon({ platform, size = 18, className = '' }) {
  const content = ICONS[platform] || ICONS.PC;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}

export function PlatformBadge({ platform, showLabel = true, size = 18, className = '' }) {
  if (!platform) return null;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <PlatformIcon platform={platform} size={size} />
      {showLabel && <span>{platform}</span>}
    </span>
  );
}
