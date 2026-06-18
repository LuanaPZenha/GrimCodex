const ACHIEVEMENT_CATEGORIES = [
  'Campanha',
  'Exploracao',
  'Classes',
  'Endgame',
  'PvP',
  'DLC VoH',
  'DLC LoH',
];

const MOUNT_CATEGORIES = [
  'Campanha',
  'Establo',
  'Cosmetica',
  'Endgame',
  'DLC VoH',
  'DLC LoH',
];

const PET_CATEGORIES = [
  'Campanha',
  'Cosmetica',
  'Endgame',
  'DLC VoH',
  'DLC LoH',
];

const ALL_ITEM_CATEGORIES = [
  ...ACHIEVEMENT_CATEGORIES,
  ...MOUNT_CATEGORIES.filter((cat) => !ACHIEVEMENT_CATEGORIES.includes(cat)),
  ...PET_CATEGORIES.filter((cat) => !ACHIEVEMENT_CATEGORIES.includes(cat)
    && !MOUNT_CATEGORIES.includes(cat)),
];

const GUIDE_TYPES = ['CONQUISTA', 'MONTARIA', 'MASCOTE'];

const CATEGORY_BY_TITLE = {
  Emancipation: 'Campanha',
  'Hatred Subdued': 'Campanha',
  'Hatred Banished': 'Campanha',

  'Estuar Sightseer': 'Exploracao',
  'Nahantu Sightseer': 'Exploracao',
  'Skovos Sojourner': 'Exploracao',

  'Hammer Down': 'Classes',
  'Shifty Swipes': 'Classes',
  'Army of Bones': 'Classes',
  'In and Out': 'Classes',
  'Master of the Elements': 'Classes',
  'Spirited Sparring': 'Classes',

  'Master Combatant': 'PvP',

  'Dedicated Protector': 'Endgame',
  'Legion Killer': 'Endgame',
  'Undead Undone': 'Endgame',
  Exterminator: 'Endgame',
  Turned: 'Endgame',
  'Tortured Souls': 'Endgame',
  'Convenient Crafts': 'Endgame',
  'Potent Alterations': 'Endgame',
  'Living Nightmares': 'Endgame',
  'Turning the Tides': 'Endgame',
  'Chaotic Whispers': 'Endgame',
  'First Aid': 'Endgame',
  'Worldly Slayer': 'Endgame',
  'Curious Collector': 'Endgame',
  'True Perseverance': 'Endgame',
  'Devoted Protector': 'Endgame',
  'End of the First Mother': 'Endgame',
  'Tormented Massacre': 'Endgame',

  'Wildland Warrior': 'DLC VoH',
  'Hireling Commander': 'DLC VoH',
  'Bane of the Khazra': 'DLC VoH',
  'Kurast Cleanser': 'DLC VoH',
  'Infernal Jungle': 'DLC VoH',
  'Devout Champion': 'DLC VoH',

  'Skovos Slayer': 'DLC LoH',
  'Demonic Dispute': 'DLC LoH',
  'Prepared to Fight': 'DLC LoH',
  'Adept Angler': 'DLC LoH',
  'Wholly Horadric': 'DLC LoH',
  'Effective Equipment': 'DLC LoH',
  'Echoing Elites': 'DLC LoH',
  'Tormented Slaughter': 'DLC LoH',
};

function assignCategory(achievement) {
  if (CATEGORY_BY_TITLE[achievement.title]) {
    return CATEGORY_BY_TITLE[achievement.title];
  }
  if (achievement.category === 'Campanha') return 'Campanha';
  return 'Endgame';
}

function withCategory(achievement) {
  return {
    ...achievement,
    category: assignCategory(achievement),
  };
}

module.exports = {
  ACHIEVEMENT_CATEGORIES,
  MOUNT_CATEGORIES,
  PET_CATEGORIES,
  ALL_ITEM_CATEGORIES,
  GUIDE_TYPES,
  assignCategory,
  withCategory,
};
