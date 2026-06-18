const fs = require('fs');
const path = require('path');

const apiUrl = (process.env.VITE_API_URL || 'http://localhost:8082/api').trim();
const socketUrl = (process.env.VITE_SOCKET_URL || apiUrl.replace(/\/api\/?$/, '')).trim();
const isLocal = /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(apiUrl);
const isRender = Boolean(process.env.RENDER);

if (isRender && (!apiUrl || isLocal)) {
  console.error('');
  console.error('ERRO DE BUILD: defina VITE_API_URL no Render (Environment).');
  console.error('Exemplo: VITE_API_URL=https://sua-api.onrender.com/api');
  console.error('Nao use localhost em producao.');
  console.error('');
  process.exit(1);
}

const config = { apiUrl, socketUrl };
const target = path.join(__dirname, '../public/config.json');

fs.writeFileSync(target, `${JSON.stringify(config, null, 2)}\n`);
console.log('config.json gerado para o build:', config);
