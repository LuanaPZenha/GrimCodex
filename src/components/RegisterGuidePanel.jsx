import { REGISTER_GUIDE } from '../utils/registerGuide';

export default function RegisterGuidePanel({ activeField }) {
  return (
    <div className="card border-red-900/30 p-6 backdrop-blur-md">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-red-600">📖 Guia de Cadastro</p>
        <h2 className="mt-1 font-display text-xl font-bold text-amber-500">
          Junte-se ao Grim Codex
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Preencha seu perfil de gamer/crítico para rastrear conquistas, reviews e progresso em Diablo IV.
        </p>
      </div>

      <ol className="space-y-4">
        {REGISTER_GUIDE.map((item, index) => {
          const isActive = activeField === item.field;
          return (
            <li
              key={item.field}
              className={`rounded-lg border p-4 transition ${
                isActive
                  ? 'border-amber-600/60 bg-amber-950/20 shadow-glow'
                  : 'border-zinc-800 bg-zinc-950/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-sm">
                  {index + 1}
                </span>
                <div>
                  <h3 className="flex items-center gap-2 font-medium text-zinc-100">
                    <span aria-hidden="true">{item.emoji}</span>
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">{item.tip}</p>
                  <p className="mt-1 text-xs text-amber-600/80">{item.example}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 rounded-lg border border-green-800/40 bg-green-950/20 p-4 text-sm text-green-300">
        <p className="font-medium">✅ Após cadastrar</p>
        <p className="mt-1 text-green-400/90">
          Você entra automaticamente no Santuário e pode consultar guias, marcar conquistas e (se admin) gerenciar gamers.
        </p>
      </div>
    </div>
  );
}
