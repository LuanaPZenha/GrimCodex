import Modal from './Modal';

import StarRating from './StarRating';

import RarityBadge from './RarityBadge';

import { getAchievementEmoji, getCategoryTheme, getDifficultyLabel, IMAGES } from '../utils/diabloTheme';



function renderGuideText(text) {

  if (!text) return null;



  return text.split('\n').map((line, index) => {

    const trimmed = line.trim();

    if (!trimmed) return <br key={index} />;



    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {

      return (

        <p key={index} className="mt-3 flex items-center gap-2 font-semibold text-amber-500">

          <span aria-hidden="true">📌</span>

          {trimmed.replace(/\*\*/g, '')}

        </p>

      );

    }



    if (trimmed.startsWith('- ')) {

      return (

        <li key={index} className="ml-4 flex gap-2 text-sm text-zinc-300">

          <span className="text-amber-600" aria-hidden="true">•</span>

          <span>{trimmed.slice(2)}</span>

        </li>

      );

    }



    if (/^\d+\./.test(trimmed)) {

      return (

        <li key={index} className="ml-4 list-decimal text-sm text-zinc-300">

          {trimmed.replace(/^\d+\.\s*/, '')}

        </li>

      );

    }



    if (trimmed.startsWith('⚠️')) {

      return (

        <p key={index} className="mt-2 rounded border border-amber-800/50 bg-amber-950/30 px-3 py-2 text-sm text-amber-300">

          {trimmed}

        </p>

      );

    }



    return (

      <p key={index} className="text-sm leading-relaxed text-zinc-300">

        {trimmed.replace(/\*\*/g, '')}

      </p>

    );

  });

}



function ContextSection({ icon, title, children, accent = 'border-zinc-800' }) {

  return (

    <section className={`rounded-lg border ${accent} bg-zinc-950/60 p-4`}>

      <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-500">

        <span aria-hidden="true">{icon}</span>

        {title}

      </h4>

      <div className="text-sm leading-relaxed text-zinc-300">{children}</div>

    </section>

  );

}



export default function ItemGuideModal({ open, item, onClose, variant = 'achievement', getEmoji }) {

  if (!item) return null;



  const emojiFn = getEmoji || getAchievementEmoji;

  const emoji = emojiFn(item.title);

  const theme = getCategoryTheme(item.category);

  const howTo = item.howTo || item.description;

  const averageTime = item.averageTime || 'Varia conforme build e co-op';

  const location = item.location || 'Sanctuary';

  const howToLabel = variant === 'mount' ? 'Como desbloquear' : 'Como fazer';

  const guideTitle = variant === 'mount' ? 'Grimório — Detalhes da montaria' : 'Grimório — Detalhes extras';



  return (

    <Modal open={open} onClose={onClose} title={`${emoji} ${item.title}`} size="xl">

      <div className={`relative -mx-2 mb-5 overflow-hidden rounded-xl border ${theme.accent} bg-gradient-to-br ${theme.gradient} p-5`}>

        <img

          src={IMAGES.cardBanner}

          alt=""

          aria-hidden="true"

          className="absolute inset-0 h-full w-full object-cover opacity-30"

        />

        <div className="absolute inset-0 bg-zinc-950/50" />

        <div className="relative flex items-center justify-between">

          <div>

            <span className="rounded-md border border-amber-700/50 bg-zinc-950/70 px-2 py-0.5 text-xs text-amber-400">

              {theme.emoji} {theme.label}

            </span>

            <p className="mt-2 text-sm text-zinc-300">{item.description}</p>

          </div>

          <span className="text-5xl drop-shadow-lg" aria-hidden="true">{emoji}</span>

        </div>

        <div className="relative mt-3 flex flex-wrap items-center gap-3">

          <RarityBadge rarity={item.rarity} size="lg" />

          <StarRating value={item.rating} size="lg" />

        </div>

      </div>



      <div className="mb-2 flex items-center gap-2">

        <span className="text-lg" aria-hidden="true">🧭</span>

        <h3 className="font-display text-sm uppercase tracking-widest text-red-600">

          Guia Contextual

        </h3>

      </div>



      <div className="mb-5 grid gap-3 sm:grid-cols-2">

        <ContextSection icon="📋" title={howToLabel} accent="border-red-900/40">

          {howTo}

        </ContextSection>



        <ContextSection icon="⏱️" title="Tempo médio" accent="border-amber-900/40">

          {averageTime}

        </ContextSection>



        <ContextSection icon="⚔️" title="Dificuldade" accent="border-purple-900/40">

          <div className="flex flex-col gap-2">

            <StarRating value={item.rating} size="lg" />

            <span>{getDifficultyLabel(item.rating)}</span>

          </div>

        </ContextSection>



        <ContextSection icon="📍" title="Localização" accent="border-emerald-900/40">

          {location}

        </ContextSection>

      </div>



      {item.guide && (

        <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-5">

          <h3 className="mb-4 flex items-center gap-2 font-display text-sm uppercase tracking-widest text-zinc-500">

            <span aria-hidden="true">📖</span>

            {guideTitle}

          </h3>

          <div className="space-y-1">{renderGuideText(item.guide)}</div>

        </div>

      )}

    </Modal>

  );

}


