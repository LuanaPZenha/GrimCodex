const PET_CATEGORY_BY_TITLE = {
  'Sistema de Pets': 'Campanha',
  Asheara: 'Campanha',
  Hratli: 'Cosmetica',
  Alkor: 'Cosmetica',
  Natalya: 'Endgame',
  Orinocta: 'Endgame',
  Iris: 'Cosmetica',
  Dorian: 'Cosmetica',
  Gorgo: 'Endgame',
};

function assignPetCategory(entry) {
  if (PET_CATEGORY_BY_TITLE[entry.title]) {
    return PET_CATEGORY_BY_TITLE[entry.title];
  }
  if (entry.category) return entry.category;
  return 'Cosmetica';
}

function withPetCategory(entry) {
  return {
    ...entry,
    category: assignPetCategory(entry),
  };
}

module.exports = {
  PET_CATEGORY_BY_TITLE,
  assignPetCategory,
  withPetCategory,
};
