const http = require('http');
const app = require('./app');
const config = require('./config');
const { connectPostgres, syncPostgres } = require('./config/database');
require('./models');
const User = require('./models/User');
const { patchUsersTable } = require('./migrations/patchUsers');
const { seedAchievements } = require('./seed/achievementsSeed');
const { seedMounts } = require('./seed/mountsSeed');
const { seedPets } = require('./seed/petsSeed');
const { initChatSocket } = require('./socket/chatSocket');

async function seedAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin1234';

  const existing = await User.findOne({ where: { email: adminEmail } });
  if (!existing) {
    await User.create({
      name: 'Administrador',
      username: 'admin',
      email: adminEmail,
      password: adminPassword,
      platform: 'PC',
      favoriteClass: 'Necromancer',
      bio: 'Conta administrativa do Grim Codex.',
      role: 'admin',
    });
    console.log(`Usuario admin criado: ${adminEmail}`);
  } else if (!existing.username) {
    await existing.update({ username: 'admin', platform: existing.platform || 'PC' });
  } else if (existing.hoursPlayed === 0 && existing.achievementsCompleted === 0) {
    await existing.update({
      hoursPlayed: 420,
      achievementsCompleted: 38,
      mostUsedClass: existing.favoriteClass || 'Necromancer',
      seasonsCompleted: 4,
      bossesDefeated: 127,
    });
  }
}

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

async function startServer() {
  try {
    await connectPostgres();
    await syncPostgres();
    try {
      await patchUsersTable(require('./config/database').sequelize);
    } catch (error) {
      console.warn('Patch users (pode ignorar se ja aplicado):', error.message);
    }
    await seedAdminUser();
    await runSeed('conquistas', seedAchievements);
    await runSeed('montarias', seedMounts);
    await runSeed('pets', seedPets);

    const server = http.createServer(app);
    initChatSocket(server);

    server.listen(config.port, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${config.port}`);
      console.log(`Ambiente: ${config.env}`);
      if (config.env === 'production') {
        console.log('Health check: GET /health');
      } else {
        console.log(`Swagger: http://localhost:${config.port}/api-docs`);
      }
      console.log('Chat ao vivo: WebSocket ativo');
    });
  } catch (error) {
    console.error('Falha ao iniciar servidor:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
