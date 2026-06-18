const PREMIUM_TITLES = new Set(['Hratli', 'Alkor', 'Iris']);

const LENDARIA_TITLES = new Set(['Gorgo']);

const EPICA_TITLES = new Set(['Natalya', 'Dorian']);

const RARA_TITLES = new Set(['Orinocta']);

const COMUM_TITLES = new Set(['Sistema de Pets', 'Asheara']);

function assignPetRarity(entry) {
  const { title, rating } = entry;

  if (entry.rarity) return String(entry.rarity).toUpperCase();
  if (PREMIUM_TITLES.has(title)) return 'PREMIUM';
  if (LENDARIA_TITLES.has(title)) return 'LENDARIA';
  if (EPICA_TITLES.has(title)) return 'EPICA';
  if (RARA_TITLES.has(title)) return 'RARA';
  if (COMUM_TITLES.has(title)) return 'COMUM';

  if (rating >= 4) return 'LENDARIA';
  if (rating >= 3) return 'EPICA';
  if (rating >= 2) return 'PREMIUM';
  return 'COMUM';
}

function withPetRarity(entry) {
  return {
    ...entry,
    rarity: assignPetRarity(entry),
  };
}

module.exports = {
  assignPetRarity,
  withPetRarity,
};
