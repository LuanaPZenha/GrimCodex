const RARITY_VALUES = ['COMUM', 'INCOMUM', 'PREMIUM', 'RARA', 'EPICA', 'LENDARIA', 'MITICA'];

const MITICA_TITLES = new Set([
  'True Perseverance',
  'Devoted Protector',
  'Devout Champion',
  'Tormented Slaughter',
]);

const LENDARIA_TITLES = new Set([
  'End of the First Mother',
  'Estuar Sightseer',
  'Bane of the Khazra',
  'Effective Equipment',
  'Echoing Elites',
  'Tormented Massacre',
]);

const EPICA_TITLES = new Set([
  'Dedicated Protector',
  'Living Nightmares',
  'Chaotic Whispers',
  'Curious Collector',
  'Wholly Horadric',
  'Prepared to Fight',
  'Kurast Cleanser',
  'Infernal Jungle',
]);

const RARA_TITLES = new Set([
  'Turning the Tides',
  'First Aid',
  'Nahantu Sightseer',
  'Skovos Sojourner',
  'Adept Angler',
  'Emancipation',
]);

function assignRarity(achievement) {
  const { title, rating } = achievement;

  if (MITICA_TITLES.has(title)) return 'MITICA';
  if (LENDARIA_TITLES.has(title)) return 'LENDARIA';
  if (EPICA_TITLES.has(title)) return 'EPICA';
  if (RARA_TITLES.has(title)) return 'RARA';

  if (rating >= 4) return 'EPICA';
  if (rating >= 3) return 'RARA';
  if (rating >= 2) return 'INCOMUM';
  return 'COMUM';
}

function withRarity(achievement) {
  return {
    ...achievement,
    rarity: achievement.rarity || assignRarity(achievement),
  };
}

module.exports = {
  RARITY_VALUES,
  assignRarity,
  withRarity,
};
