const fs = require('fs');
const path = require('path');

const isRender = Boolean(process.env.RENDER);
const localDefault = 'http://localhost:8082/api';
const renderApiDefault = 'https://grimcodex-api.onrender.com/api';
const renderSocketDefault = 'https://grimcodex-api.onrender.com';

let apiUrl = (
  process.env.VITE_API_URL ||
  process.env.API_URL ||
  (isRender ? renderApiDefault : localDefault)
).trim();

let socketUrl = (
  process.env.VITE_SOCKET_URL ||
  process.env.SOCKET_URL ||
  (apiUrl ? apiUrl.replace(/\/api\/?$/, '') : renderSocketDefault)
).trim();

const isLocal = /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(apiUrl);

if (isRender && isLocal) {
  console.error('');
  console.error('ERRO DE BUILD: VITE_API_URL nao pode ser localhost no Render.');
  console.error('Exemplo: VITE_API_URL=https://grimcodex-api.onrender.com/api');
  console.error('');
  process.exit(1);
}

if (isRender && !(process.env.VITE_API_URL || process.env.API_URL)) {
  console.warn('VITE_API_URL nao definida no Render; usando padrao:', apiUrl);
}

const config = { apiUrl, socketUrl };
const target = path.join(__dirname, '../public/config.json');

fs.writeFileSync(target, `${JSON.stringify(config, null, 2)}\n`);
console.log('config.json gerado para o build:', config);
