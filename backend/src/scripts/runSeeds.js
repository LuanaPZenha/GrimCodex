require('dotenv').config();
const { runSeeds } = require('../db/init');

runSeeds()
  .then(() => {
    console.log('Seeds concluidos.');
  })
  .catch((error) => {
    console.error('Falha ao executar seeds:', error.message);
    process.exit(1);
  });
