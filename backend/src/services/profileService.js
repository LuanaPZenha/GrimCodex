const User = require('../models/User');
const AppError = require('../utils/AppError');

const STAT_FIELDS = [
  'hoursPlayed',
  'achievementsCompleted',
  'mostUsedClass',
  'seasonsCompleted',
  'bossesDefeated',
];

async function listProfiles() {
  const users = await User.findAll({
    order: [['name', 'ASC']],
    attributes: { exclude: ['password'] },
  });
  return users.map((u) => u.toPublicJSON());
}

async function getProfileByUsername(username) {
  const user = await User.findOne({
    where: { username: String(username).trim().toLowerCase() },
  });
  if (!user) {
    throw new AppError('Jogador nao encontrado', 404);
  }
  return user.toPublicJSON();
}

async function getOwnProfile(userId) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('Usuario nao encontrado', 404);
  }
  return user.toPublicJSON({ includeEmail: true });
}

function mapStatsPayload(data) {
  const payload = {};

  if (data.hoursPlayed !== undefined) payload.hoursPlayed = Number(data.hoursPlayed);
  if (data.horasJogadas !== undefined) payload.hoursPlayed = Number(data.horasJogadas);
  if (data.achievementsCompleted !== undefined) {
    payload.achievementsCompleted = Number(data.achievementsCompleted);
  }
  if (data.conquistasConcluidas !== undefined) {
    payload.achievementsCompleted = Number(data.conquistasConcluidas);
  }
  if (data.mostUsedClass !== undefined) payload.mostUsedClass = data.mostUsedClass;
  if (data.classeMaisUsada !== undefined) payload.mostUsedClass = data.classeMaisUsada;
  if (data.seasonsCompleted !== undefined) payload.seasonsCompleted = Number(data.seasonsCompleted);
  if (data.temporadasConcluidas !== undefined) {
    payload.seasonsCompleted = Number(data.temporadasConcluidas);
  }
  if (data.bossesDefeated !== undefined) payload.bossesDefeated = Number(data.bossesDefeated);
  if (data.chefesDerrotados !== undefined) payload.bossesDefeated = Number(data.chefesDerrotados);

  if (payload.mostUsedClass === 'Nenhuma') {
    payload.mostUsedClass = null;
  }

  return payload;
}

async function updateOwnStats(userId, data) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('Usuario nao encontrado', 404);
  }

  const updates = mapStatsPayload(data);
  if (Object.keys(updates).length === 0) {
    throw new AppError('Nenhuma estatistica informada', 400);
  }

  await user.update(updates);
  return user.toPublicJSON({ includeEmail: true });
}

module.exports = {
  listProfiles,
  getProfileByUsername,
  getOwnProfile,
  updateOwnStats,
  STAT_FIELDS,
};
