const fs = require('fs');
const path = require('path');

const isRender = Boolean(process.env.RENDER);
const localDefault = 'http://localhost:8082/api';

const rawApi =
  process.env.VITE_API_URL ||
  process.env.API_URL ||
  (isRender ? '' : localDefault);

const apiUrl = rawApi.trim();
const socketUrl = (
  process.env.VITE_SOCKET_URL ||
  process.env.SOCKET_URL ||
  apiUrl.replace(/\/api\/?$/, '')
).trim();

const isLocal = /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(apiUrl);

if (isRender && (!apiUrl || isLocal)) {
  console.error('');
  console.error('ERRO DE BUILD: defina VITE_API_URL no Render (Environment).');
  console.error('Static Site: Environment > Build Environment Variables');
  console.error('Docker: Environment (disponivel no build e no runtime)');
  console.error('Exemplo: VITE_API_URL=https://grimcodex-api.onrender.com/api');
  console.error('         VITE_SOCKET_URL=https://grimcodex-api.onrender.com');
  console.error('Nao use localhost em producao.');
  console.error('Se o servico usa o Dockerfile de dev, troque para Static Site ou Dockerfile.prod.');
  console.error('');
  process.exit(1);
}

const config = { apiUrl, socketUrl };
const target = path.join(__dirname, '../public/config.json');

fs.writeFileSync(target, `${JSON.stringify(config, null, 2)}\n`);
console.log('config.json gerado para o build:', config);
