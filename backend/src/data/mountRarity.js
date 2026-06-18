const MITICA_TITLES = new Set(['Luminous Steed']);

const LENDARIA_TITLES = new Set(['Born in Darkness', "Temptation's Ride", 'Kurast Riding Steed']);

const EPICA_TITLES = new Set(['Red Furied Steed', 'Skovos Riding Steed', 'Helltide Mount Armor']);

const RARA_TITLES = new Set([
  'Mount Trophy — Nahantu',
  'Mount Trophy — Skovos',
  'Midnight Steed',
  'Pale Steed',
]);

function assignMountRarity(mount) {
  const { title, rating } = mount;

  if (MITICA_TITLES.has(title)) return 'MITICA';
  if (LENDARIA_TITLES.has(title)) return 'LENDARIA';
  if (EPICA_TITLES.has(title)) return 'EPICA';
  if (RARA_TITLES.has(title)) return 'RARA';

  if (rating >= 4) return 'EPICA';
  if (rating >= 3) return 'RARA';
  if (rating >= 2) return 'INCOMUM';
  return 'COMUM';
}

function withMountRarity(mount) {
  return {
    ...mount,
    rarity: mount.rarity || assignMountRarity(mount),
  };
}

module.exports = {
  assignMountRarity,
  withMountRarity,
};
