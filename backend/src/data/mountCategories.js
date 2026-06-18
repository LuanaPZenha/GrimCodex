const MOUNT_CATEGORY_BY_TITLE = {
  "Gillian's Steed": 'Campanha',
  'Stable Master & Renown': 'Establo',
  'Mount Trophy — Fractured Peaks': 'Establo',
  'Mount Trophy — Scosglen': 'Establo',
  'Mount Trophy — Dry Steppes': 'Establo',
  'Mount Trophy — Kehjistan': 'Establo',
  'Mount Trophy — Hawezar': 'Establo',
  'Midnight Steed': 'Cosmetica',
  'Born in Darkness': 'Cosmetica',
  "Temptation's Ride": 'Cosmetica',
  'Luminous Steed': 'Cosmetica',
  'Red Furied Steed': 'Cosmetica',
  'Pale Steed': 'Cosmetica',
  'Helltide Mount Armor': 'Endgame',
  'Nahantu Mule': 'DLC VoH',
  'Mount Trophy — Nahantu': 'DLC VoH',
  'Kurast Riding Steed': 'DLC VoH',
  'Skovos Riding Steed': 'DLC LoH',
  'Mount Trophy — Skovos': 'DLC LoH',
};

function assignMountCategory(mount) {
  if (MOUNT_CATEGORY_BY_TITLE[mount.title]) {
    return MOUNT_CATEGORY_BY_TITLE[mount.title];
  }
  if (mount.category) return mount.category;
  return 'Establo';
}

function withMountCategory(mount) {
  return {
    ...mount,
    category: assignMountCategory(mount),
  };
}

module.exports = {
  MOUNT_CATEGORY_BY_TITLE,
  assignMountCategory,
  withMountCategory,
};
