const config = require('../config');
const { connectPostgres, sequelize } = require('../config/database');
require('../models');
const { seedAchievements } = require('../seed/achievementsSeed');
const { seedMounts } = require('../seed/mountsSeed');
const { seedPets } = require('../seed/petsSeed');

async function runSeed(label, fn) {
  try {
    await fn();
  } catch (error) {
    console.error(`Seed ${label} falhou:`, error.message);
    if (config.env !== 'production') {
      console.error(error.stack);
    }
  }
}

async function runSeeds() {
  await connectPostgres();
  try {
    await runSeed('conquistas', seedAchievements);
    await runSeed('montarias', seedMounts);
    await runSeed('pets', seedPets);
  } finally {
    await sequelize.close();
  }
}

module.exports = { runSeeds };
