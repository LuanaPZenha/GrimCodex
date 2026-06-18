require('dotenv').config();
const { connectPostgres, syncPostgres } = require('../config/database');
require('../models');
const { seedAchievements } = require('../seed/achievementsSeed');
const { seedMounts } = require('../seed/mountsSeed');
const { seedPets } = require('../seed/petsSeed');

async function main() {
  const only = process.argv[2];

  await connectPostgres();
  await syncPostgres();

  if (!only || only === 'achievements') await seedAchievements();
  if (!only || only === 'mounts') await seedMounts();
  if (!only || only === 'pets') await seedPets();

  const { sequelize } = require('../config/database');
  await sequelize.close();
  console.log('Seeds concluidos.');
}

main().catch((error) => {
  console.error('Falha ao executar seeds:', error.message);
  process.exit(1);
});
