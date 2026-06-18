const http = require('http');
const app = require('./app');
const config = require('./config');
const { connectPostgres } = require('./config/database');
require('./models');
const { initChatSocket } = require('./socket/chatSocket');

async function startServer() {
  try {
    await connectPostgres();

    const server = http.createServer(app);
    initChatSocket(server);

    server.listen(config.port, '0.0.0.0', () => {
      console.log(`Servidor Grim Codex (PostgreSQL) na porta ${config.port}`);
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
