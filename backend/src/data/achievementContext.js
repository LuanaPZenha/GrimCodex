const CONTEXT_BY_TITLE = {
  Emancipation: {
    howTo: 'Complete os 6 Atos da campanha principal e derrote Lilith no Ato final. Desbloqueie a montaria no Ato 3 para acelerar a exploração.',
    averageTime: '~15–25 horas',
    location: 'Estuar — Fractured Peaks, Scosglen, Dry Steppes, Kehjistan e Hawezar',
  },
  'Dedicated Protector': {
    howTo: 'Alcance o nível 50 fazendo campanha, Renome, Masmorras Laterais, Helltides e eventos da Árvore dos Sussurros. Use Elixires de XP e co-op (+10% XP).',
    averageTime: '~25–40 horas',
    location: 'Qualquer região de Sanctuary após a campanha',
  },
  'Legion Killer': {
    howTo: 'Elimine 666 inimigos somando Demônios, Decaídos e Homens-Cabra. O progresso acumula em todas as dificuldades — não precisa de farm dedicado.',
    averageTime: 'Naturalmente durante a campanha',
    location: 'Kehjistan, Hawezar, Fractured Peaks, Scosglen e Dry Steppes',
  },
  'Undead Undone': {
    howTo: 'Mate 666 Fantasmas, Esqueletos ou Zumbis. Explore Masmorras Laterais em Scosglen para acelerar.',
    averageTime: 'Naturalmente durante a campanha',
    location: 'Fractured Peaks e Scosglen (principalmente)',
  },
  Exterminator: {
    howTo: 'Elimine 666 Serpentes ou Aranhas explorando cavernas e pântanos nas regiões indicadas.',
    averageTime: '2–5 horas de exploração focada',
    location: 'Scosglen e Hawezar',
  },
  Turned: {
    howTo: 'Elimine 666 Afogados, Vampiros ou Lobisomens. Afogados aparecem na costa; Vampiros em Fractured Peaks; Lobisomens em Scosglen.',
    averageTime: 'Naturalmente durante a campanha',
    location: 'Costas, Fractured Peaks e Scosglen',
  },
  'Tortured Souls': {
    howTo: 'Elimine 666 Bandidos, Cultistas ou Cavaleiros. Fortalezas e acampamentos de bandidos são farms rápidos.',
    averageTime: 'Naturalmente durante a campanha',
    location: 'Fractured Peaks, Kehjistan, Dry Steppes e Hawezar',
  },
  'Hammer Down': {
    howTo: 'Como Bárbaro, ative Berserking (Upheaval Violent ou Double Swing Furious) e mate 50 inimigos enquanto o buff laranja estiver ativo.',
    averageTime: '15–30 minutos',
    location: 'Qualquer zona — funciona desde level baixo',
  },
  'Shifty Swipes': {
    howTo: 'Como Druida, mate 50 inimigos em forma Urso (Maul) e 50 em forma Lobisomem (Claw). Alterne entre as formas até completar ambas metas.',
    averageTime: '20–40 minutos',
    location: 'Qualquer zona — Prologue ou Ato 1',
  },
  'Army of Bones': {
    howTo: 'Como Necromante, invoque 100 Esqueletos Magos ou Guerreiros com Raise Skeleton. Troque habilidade no Livro dos Mortos para despachar e reinvocar rapidamente.',
    averageTime: '20–30 minutos',
    location: 'Qualquer zona com cadáveres disponíveis',
  },
  'In and Out': {
    howTo: 'Como Ladina, mate 50 inimigos corpo a corpo (skills de Faca) e 50 à distância (Arco). Mantenha distância ao usar arco para contar como ranged.',
    averageTime: '20–30 minutos',
    location: 'Qualquer zona — Prologue ou Ato 1',
  },
  'Master of the Elements': {
    howTo: 'Como Feiticeiro, mate 100 inimigos com dano de Fogo, Gelo ou Raio (Frost Bolt, Fire Bolt, Spark ou Arc Lash).',
    averageTime: '15–25 minutos',
    location: 'Qualquer zona — Prologue ou Ato 1',
  },
  'Convenient Crafts': {
    howTo: 'No Alquimista, crafte 1 Elixir (level 10+) e 1 Incenso (level 45+). Elixir of Advantage e Song of the Mountain são opções acessíveis.',
    averageTime: '30 minutos (com materiais)',
    location: 'Alquimista — Kyovashad, Ked Bardu ou qualquer cidade principal',
  },
  'Potent Alterations': {
    howTo: 'No Ferreiro (level 10+), use Temper em uma Armadura, uma Joia e uma Arma para adicionar um afixo extra em cada.',
    averageTime: '15 minutos (com gear elegível)',
    location: 'Ferreiro — qualquer cidade principal',
  },
  'Living Nightmares': {
    howTo: 'Complete uma Masmorra Pesadelo em Tormento II ou superior. Obtenha Sigilos via Whispers, Helltide ou Occultist.',
    averageTime: '1–3 horas (após desbloquear Torment II)',
    location: 'Masmorras Pesadelo — mapa mundial',
  },
  'Turning the Tides': {
    howTo: 'Colete 1.000 Aberrant Cinders em zonas Helltide. Mate elites, complete eventos e invoque Hellbornes enchendo o Threat Meter.',
    averageTime: '5–10 Helltides (~8–15 horas)',
    location: 'Zonas Helltide ativas — qualquer região base',
  },
  'Chaotic Whispers': {
    howTo: 'Ganhe 10 Grim Favors em eventos Whispers e abra 10 Caches of Chaos na Árvore dos Sussurros (escolha sempre Collection of Chaos).',
    averageTime: '3–6 horas de farm Whispers',
    location: 'Árvore dos Sussurros — regiões com eventos Whisper of the Dead',
  },
  'First Aid': {
    howTo: 'Upgrade sua Poção de Cura tier por tier até Superior (level 60). Colete Angelbreath em Helltides para os materiais finais.',
    averageTime: '2–5 horas (ou semanas no endgame)',
    location: 'Alquimista — cidade principal',
  },
  'Master Combatant': {
    howTo: 'Consiga 5 eliminações PvP nos Fields of Hatred. Marque jogadores com "Mark for Blood" no Gesture Wheel antes de atacar.',
    averageTime: '30 min – 2 horas',
    location: 'Fields of Hatred — Dry Steppes e Kehjistan',
  },
  'Worldly Slayer': {
    howTo: 'Derrote qualquer World Boss (Ashava, Avarice ou Wandering Death). Siga o ícone no mapa ~30 min antes do spawn e junte-se a outros jogadores.',
    averageTime: '30 min – 2 horas (espera + fight)',
    location: 'Spawn rotativo — 5 regiões base (+ Nahantu com VoH)',
  },
  'Estuar Sightseer': {
    howTo: 'Explore 100% das 305 áreas do mapa base (74+70+51+54+56). Use montaria e verifique Renome de cada região.',
    averageTime: '5–10 horas dedicadas',
    location: 'Estuar — Fractured Peaks, Scosglen, Dry Steppes, Kehjistan e Hawezar',
  },
  'Curious Collector': {
    howTo: 'Imprima 10 Aspectos do Codex of Power no Occultist em itens Rare. Pode repetir o mesmo Aspect em itens diferentes.',
    averageTime: '2–4 horas (com Codex desbloqueado)',
    location: 'Occultist — qualquer cidade principal',
  },
  'True Perseverance': {
    howTo: 'Alcance level 50 em personagem Hardcore sem morrer. Foque em Renome e evite Side Dungeons com Butcher. Jogue em Normal para minimizar risco.',
    averageTime: '~20 horas (ou poucas horas com carry)',
    location: 'Hardcore — qualquer região de Sanctuary',
  },
  'Devoted Protector': {
    howTo: 'Alcance Paragon Level 200. Farme XP em The Pit, Nightmare Dungeons, Helltides e Infernal Hordes em Torment IV.',
    averageTime: '70–100+ horas de endgame',
    location: 'The Pit, Masmorras Pesadelo e conteúdo Torment IV',
  },
  'End of the First Mother': {
    howTo: 'Derrote Uber Lilith (Echo of Lilith) na Echo of Hatred Capstone Dungeon em Torment I+. Build otimizada e co-op recomendados.',
    averageTime: '1–5 horas (preparação + tentativas)',
    location: 'Echo of Hatred — perto de Nevesk, Fractured Peaks',
  },
  'Hatred Subdued': {
    howTo: 'Complete a campanha da expansão Vessel of Hatred (Ato VII) em Nahantu.',
    averageTime: '3–6 horas',
    location: 'Nahantu — Ato VII',
  },
  'Wildland Warrior': {
    howTo: 'Elimine 666 Dregs, Lacuni ou Hollows em Nahantu. Progresso vem naturalmente na campanha VoH e exploração.',
    averageTime: 'Naturalmente durante VoH',
    location: 'Nahantu',
  },
  'Spirited Sparring': {
    howTo: 'Como Spiritborn, mate 500 inimigos usando Ultimate Skills. Use Ultimate sempre off cooldown em áreas densas de mobs.',
    averageTime: '2–4 horas',
    location: 'Helltides, Infernal Hordes ou Nahantu',
  },
  'Nahantu Sightseer': {
    howTo: 'Explore 100% das 58 áreas de Nahantu. Complete a side quest "Blood in the Grove" para desbloquear 1 área bloqueada.',
    averageTime: '3–5 horas de exploração',
    location: 'Nahantu — todas as sub-regiões',
  },
  'Tormented Massacre': {
    howTo: 'Derrote 1.000 Elites em Torment IV. Infernal Hordes com Compasses são o farm mais eficiente.',
    averageTime: '15–30 horas de endgame T4',
    location: 'Infernal Hordes, Helltides Nahantu, The Pit — Torment IV',
  },
  'Hireling Commander': {
    howTo: 'Alcance level 10 com Raheir, Varyana, Aldkin e Subo. Solo levela mais rápido (2 mercenários ativos = 2x XP).',
    averageTime: '3–6 horas',
    location: 'The Den — Nahantu (Mercenários)',
  },
  'Bane of the Khazra': {
    howTo: 'Complete a Dark Citadel co-op: Enclave of Strife → Labyrinth of Souls → Dominion of Zagraal. Use Party Finder — não é possível solo.',
    averageTime: '1–3 horas (com grupo)',
    location: 'Dark Citadel — Kurast, Nahantu (Torment I+)',
  },
  'Kurast Cleanser': {
    howTo: 'Complete 25 runs da Kurast Undercity. Mate mobs e estruturas para ganhar tempo extra e chegar ao boss final.',
    averageTime: '2–4 horas eficientes',
    location: 'Kurast Undercity — Nahantu',
  },
  'Devout Champion': {
    howTo: 'Alcance Paragon Level 300 (cap máximo com VoH). Continue farmando The Pit tier alto, Infernal Hordes e Nightmare Dungeons.',
    averageTime: '100+ horas além do Paragon 200',
    location: 'Endgame VoH — Torment IV',
  },
  'Infernal Jungle': {
    howTo: 'Colete 10.000 Aberrant Cinders em Helltides de Nahantu. Invocar Blood Maiden (3 Baleful Hearts) acelera o farm.',
    averageTime: '5–7 Helltides completas (~10–15 horas)',
    location: 'Helltides de Nahantu',
  },
  'Hatred Banished': {
    howTo: 'Complete a campanha da expansão Lord of Hatred em Skovos.',
    averageTime: '3–6 horas',
    location: 'Skovos — campanha LoH',
  },
  'Skovos Sojourner': {
    howTo: 'Explore 100% de Skovos. Complete a campanha LoH primeiro para desbloquear todas as áreas.',
    averageTime: '3–5 horas de exploração',
    location: 'Skovos — todas as sub-regiões',
  },
  'Demonic Dispute': {
    howTo: 'Mate 100 inimigos com habilidades de Demonology (nova árvore de skills LoH). Equipe e use em combate em áreas densas.',
    averageTime: '1–2 horas',
    location: 'Skovos — Helltides ou Hordes',
  },
  'Skovos Slayer': {
    howTo: 'Elimine 666 Golems, Merfolk ou Morlu em Skovos. Masmorras de Skovos aceleram o farm.',
    averageTime: 'Naturalmente durante LoH',
    location: 'Skovos',
  },
  'Prepared to Fight': {
    howTo: 'Complete 10 War Plans — conteúdo estruturado de LoH com objetivos de combate específicos.',
    averageTime: '4–8 horas',
    location: 'Skovos — War Plans (progresso LoH)',
  },
  'Adept Angler': {
    howTo: 'Colete todos os tipos de peixe de uma região inteira. Visite pontos de pesca marcados no mapa.',
    averageTime: '2–5 horas por região',
    location: 'Pontos de pesca — Skovos ou regiões LoH',
  },
  'Wholly Horadric': {
    howTo: 'Equipe 5 Charms Horadric compatíveis para ativar o bônus de set completo.',
    averageTime: '5–15 horas de farm',
    location: 'Skovos e endgame LoH — Echoing Hatred',
  },
  'Effective Equipment': {
    howTo: 'Equipe gear Transfigured em todos os slots: Arma, Off-hand, Helmet, Chest, Gloves, Pants, Boots, Amulet e 2 Rings.',
    averageTime: '10–25 horas de endgame LoH',
    location: 'Echoing Hatred e conteúdo Skovos',
  },
  'Echoing Elites': {
    howTo: 'Mate 1.000 Bosses ou Elites em Echoing Hatred. Acumule kills ao jogar endgame LoH regularmente.',
    averageTime: '20–40 horas',
    location: 'Echoing Hatred — Skovos endgame',
  },
  'Tormented Slaughter': {
    howTo: 'Derrote 1.000 Elites em Torment XII. Exige build otimizada e gear endgame elevado.',
    averageTime: '30–50+ horas dedicadas',
    location: 'Infernal Hordes, The Pit e Echoing Hatred — Torment XII',
  },
};

function withContext(achievement) {
  const ctx = CONTEXT_BY_TITLE[achievement.title] || {};
  return {
    ...achievement,
    howTo: ctx.howTo || achievement.description || '',
    averageTime: ctx.averageTime || 'Varia conforme build',
    location: ctx.location || 'Sanctuary',
  };
}

module.exports = { CONTEXT_BY_TITLE, withContext };
