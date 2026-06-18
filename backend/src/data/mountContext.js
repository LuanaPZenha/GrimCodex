const CONTEXT_BY_TITLE = {
  "Gillian's Steed": {
    howTo: 'Complete a quest "Mount: What Lies Ahead" no Ato 3. Derrote o boss do estábulo em Scosglen e fale com Gillian para receber sua primeira montaria.',
    averageTime: '1–2 horas (Ato 3)',
    location: 'Scosglen — quest do Ato 3',
  },
  'Stable Master & Renown': {
    howTo: 'Ganhe Renown em cada região completando eventos, side quests e explorando. Visite o Stable Master nas cidades para comprar troféus, armaduras e skins com Renown acumulado.',
    averageTime: 'Contínuo durante a campanha',
    location: 'Stable Master — Kyovashad, Ked Bardu, Gea Kul, Caldeira e outros',
  },
  'Mount Trophy — Fractured Peaks': {
    howTo: 'Alcance Renown Tier 3 em Fractured Peaks e compre o troféu de montaria no Stable Master. Troféus alteram a aparência da montaria equipada.',
    averageTime: '2–4 horas de Renown na região',
    location: 'Stable Master — Fractured Peaks (Nevesk)',
  },
  'Mount Trophy — Scosglen': {
    howTo: 'Alcance Renown Tier 3 em Scosglen e compre o troféu regional no Stable Master.',
    averageTime: '2–4 horas de Renown na região',
    location: 'Stable Master — Scosglen (Túr Dúlra)',
  },
  'Mount Trophy — Dry Steppes': {
    howTo: 'Alcance Renown Tier 3 em Dry Steppes e compre o troféu regional no Stable Master.',
    averageTime: '2–4 horas de Renown na região',
    location: 'Stable Master — Dry Steppes (Jadaan)',
  },
  'Mount Trophy — Kehjistan': {
    howTo: 'Alcance Renown Tier 3 em Kehjistan e compre o troféu regional no Stable Master.',
    averageTime: '2–4 horas de Renown na região',
    location: 'Stable Master — Kehjistan (Alcarnus)',
  },
  'Mount Trophy — Hawezar': {
    howTo: 'Alcance Renown Tier 3 em Hawezar e compre o troféu regional no Stable Master.',
    averageTime: '2–4 horas de Renown na região',
    location: 'Stable Master — Hawezar (Bakrashen)',
  },
  'Midnight Steed': {
    howTo: 'Disponível na Loja Premium do jogo. Compre o pacote ou montaria individual com Platinum.',
    averageTime: 'Instantâneo (compra)',
    location: 'Loja Premium — menu principal do jogo',
  },
  'Born in Darkness': {
    howTo: 'Montaria premium disponível na Loja Premium. Parte de pacotes de cosméticos sazonais.',
    averageTime: 'Instantâneo (compra)',
    location: 'Loja Premium — menu principal do jogo',
  },
  "Temptation's Ride": {
    howTo: 'Montaria premium com visual demoníaco. Adquira na Loja Premium ou em pacotes de temporada.',
    averageTime: 'Instantâneo (compra)',
    location: 'Loja Premium — menu principal do jogo',
  },
  'Luminous Steed': {
    howTo: 'Montaria premium de alto tier com efeito luminoso. Disponível na Loja Premium em rotação sazonal.',
    averageTime: 'Instantâneo (compra)',
    location: 'Loja Premium — menu principal do jogo',
  },
  'Red Furied Steed': {
    howTo: 'Montaria cosmética vermelha. Disponível na Loja Premium ou recompensa de Battle Pass em temporadas específicas.',
    averageTime: 'Instantâneo ou progresso de BP',
    location: 'Loja Premium / Battle Pass',
  },
  'Pale Steed': {
    howTo: 'Montaria cosmética pálida. Verifique a Loja Premium e recompensas de Renown Tier 5 em algumas regiões.',
    averageTime: 'Varia — compra ou Renown alto',
    location: 'Loja Premium ou Stable Master (Renown Tier 5)',
  },
  'Helltide Mount Armor': {
    howTo: 'Abra Tortured Gifts em Helltides para chance de drop de peças de armadura de montaria. Equipe no Stable Master.',
    averageTime: '3–8 Helltides',
    location: 'Helltides — Tortured Gifts em qualquer região',
  },
  'Nahantu Mule': {
    howTo: 'Desbloqueie durante a campanha VoH ou compre no Stable Master de Nahantu após progresso de Renown na região.',
    averageTime: '1–3 horas (VoH campanha)',
    location: 'Nahantu — Stable Master / campanha VoH',
  },
  'Mount Trophy — Nahantu': {
    howTo: 'Alcance Renown Tier 3 em Nahantu e compre o troféu exclusivo da expansão no Stable Master.',
    averageTime: '3–5 horas de Renown em Nahantu',
    location: 'Stable Master — Nahantu (Kurast)',
  },
  'Kurast Riding Steed': {
    howTo: 'Montaria temática de Kurast. Disponível via Renown Tier 4+ em Nahantu ou pacotes VoH na Loja Premium.',
    averageTime: '5–10 horas de Renown VoH',
    location: 'Stable Master — Nahantu / Loja Premium',
  },
  'Skovos Riding Steed': {
    howTo: 'Montaria exclusiva de Skovos no Lord of Hatred. Desbloqueie via Renown ou recompensa de campanha LoH.',
    averageTime: '2–5 horas (LoH)',
    location: 'Skovos — Stable Master / campanha LoH',
  },
  'Mount Trophy — Skovos': {
    howTo: 'Alcance Renown Tier 3 em Skovos e compre o troféu regional no Stable Master.',
    averageTime: '3–5 horas de Renown em Skovos',
    location: 'Stable Master — Skovos',
  },
};

function withMountContext(mount) {
  const ctx = CONTEXT_BY_TITLE[mount.title] || {};
  return {
    ...mount,
    howTo: ctx.howTo || mount.description || '',
    averageTime: ctx.averageTime || 'Varia conforme progresso',
    location: ctx.location || 'Sanctuary',
  };
}

module.exports = { CONTEXT_BY_TITLE, withMountContext };
