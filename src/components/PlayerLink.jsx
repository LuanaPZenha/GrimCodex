import { Link } from 'react-router-dom';

export default function PlayerLink({ username, className = '' }) {
  if (!username) return null;

  return (
    <Link
      to={`/players/${username}`}
      onClick={(e) => e.stopPropagation()}
      className={`font-medium text-amber-500 hover:text-amber-400 hover:underline ${className}`}
    >
      @{username}
    </Link>
  );
}
