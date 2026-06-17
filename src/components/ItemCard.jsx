import StatusBadge from './StatusBadge';

import RarityBadge from './RarityBadge';

import StarRating from './StarRating';

import { getAchievementEmoji, getCategoryTheme, getDifficultyLabel, getRarityTheme, IMAGES } from '../utils/diabloTheme';



export default function ItemCard({ item, onViewGuide, onEdit, onDelete, deleting, getEmoji, clickHint }) {

  const theme = getCategoryTheme(item.category);

  const rarityTheme = getRarityTheme(item.rarity);

  const emoji = getEmoji ? getEmoji(item.title) : getAchievementEmoji(item.title);

  const hasGuide = item.howTo || item.guide || item.description;



  const handleCardClick = () => {

    if (hasGuide) onViewGuide(item);

  };



  const stopPropagation = (event) => event.stopPropagation();



  return (

    <article

      role={hasGuide ? 'button' : undefined}

      tabIndex={hasGuide ? 0 : undefined}

      onClick={handleCardClick}

      onKeyDown={(event) => {

        if (hasGuide && (event.key === 'Enter' || event.key === ' ')) {

          event.preventDefault();

          onViewGuide(item);

        }

      }}

      className={`group card relative flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 ${rarityTheme.cardBorder} ${rarityTheme.cardGlow} ${hasGuide ? 'cursor-pointer' : ''}`}

    >

      <div className="absolute left-3 top-3 z-10">

        <StatusBadge status={item.status} />

      </div>

      <div className="absolute right-3 top-3 z-10">

        <RarityBadge rarity={item.rarity} />

      </div>

      <div className={`relative flex h-36 items-end overflow-hidden bg-gradient-to-br ${theme.gradient} p-4`}>

        <img

          src={IMAGES.cardBanner}

          alt=""

          aria-hidden="true"

          className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-luminosity transition duration-300 group-hover:opacity-55 group-hover:scale-105"

        />

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />



        <span className="absolute right-3 top-14 text-4xl drop-shadow-lg transition group-hover:scale-110" aria-hidden="true">

          {emoji}

        </span>



        <span className={`relative rounded-md border ${theme.accent} bg-zinc-950/70 px-2.5 py-1 text-xs font-medium text-amber-400 backdrop-blur-sm`}>

          {theme.emoji} {theme.label}

        </span>

      </div>



      <div className="flex flex-1 flex-col p-4">

        <h3 className="flex items-start gap-2 font-display text-base font-semibold text-zinc-100 group-hover:text-amber-500">

          <span className="text-lg" aria-hidden="true">{emoji}</span>

          <span>{item.title}</span>

        </h3>

        <p className="mt-2 line-clamp-2 flex-1 text-sm text-zinc-400">{item.description}</p>

        <p className="mt-2 text-xs text-zinc-500">{getDifficultyLabel(item.rating)}</p>



        {hasGuide && (

          <p className="mt-3 w-full rounded-lg border border-red-800/30 bg-red-950/20 py-2.5 text-center text-xs font-medium text-amber-500/90 transition group-hover:border-red-600/50 group-hover:bg-red-950/40 group-hover:text-amber-400">

            {clickHint || '🧭 Clique para ver o guia contextual'}

          </p>

        )}



        <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3" onClick={stopPropagation}>

          <StarRating value={item.rating} />

          <div className="flex gap-2">

            <button type="button" onClick={() => onEdit(item)} className="btn-secondary px-3 py-1 text-xs" title="Editar">

              ✏️

            </button>

            <button

              type="button"

              onClick={() => onDelete(item)}

              disabled={deleting}

              className="btn-danger px-3 py-1 text-xs"

              title="Excluir"

            >

              {deleting ? '⏳' : '🗑️'}

            </button>

          </div>

        </div>

      </div>

    </article>

  );

}


