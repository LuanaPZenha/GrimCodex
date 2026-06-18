const CONTEXT_BY_TITLE = {
  'Sistema de Pets': {
    howTo: 'Conclua a missão "Fé Perdida" em Kyovashad para desbloquear o sistema e receber Asheara.',
    averageTime: '1 missão (~15–30 min)',
    location: 'Kyovashad — Fractured Peaks',
  },
  Asheara: {
    howTo: 'Complete a missão "Fé Perdida" (Faithful Companion) em Kyovashad.',
    averageTime: 'Gratuito (missão)',
    location: 'Kyovashad',
  },
  Hratli: {
    howTo: 'Compre na Loja do jogo com Platinum. Equipe em Cosméticos → Pet.',
    averageTime: 'Instantâneo (compra)',
    location: 'Loja do jogo',
  },
  Alkor: {
    howTo: 'Compre na Loja do jogo com Platinum. Equipe em Cosméticos → Pet.',
    averageTime: 'Instantâneo (compra)',
    location: 'Loja do jogo',
  },
  Natalya: {
    howTo: 'Avance níveis do Passe de Batalha até desbloquear o tier do pet.',
    averageTime: 'Varia (progresso de BP)',
    location: 'Passe de Batalha — temporada ativa',
  },
  Orinocta: {
    howTo: 'Participe de eventos especiais e promoções sazonais.',
    averageTime: 'Limitado ao evento',
    location: 'Eventos especiais',
  },
  Iris: {
    howTo: 'Compre na Loja do jogo com Platinum. Equipe em Cosméticos → Pet.',
    averageTime: 'Instantâneo (compra)',
    location: 'Loja do jogo',
  },
  Dorian: {
    howTo: 'Adquira em pacotes promocionais da Loja do jogo.',
    averageTime: 'Instantâneo (pacote)',
    location: 'Loja do jogo — pacotes promocionais',
  },
  Gorgo: {
    howTo: 'Desbloqueie via conteúdo sazonal da temporada ativa.',
    averageTime: 'Limitado à temporada',
    location: 'Conteúdo sazonal',
  },
};

function withPetContext(entry) {
  const context = CONTEXT_BY_TITLE[entry.title] || {};
  return {
    ...entry,
    howTo: entry.howTo || context.howTo || entry.description,
    averageTime: entry.averageTime || context.averageTime || 'Instantâneo',
    location: entry.location || context.location || 'Sanctuary',
  };
}

module.exports = {
  CONTEXT_BY_TITLE,
  withPetContext,
};
