const fs = require('fs');
const path = require('path');

const apiUrl = process.env.VITE_API_URL || '';
const socketUrl = process.env.VITE_SOCKET_URL || apiUrl.replace(/\/api\/?$/, '');

const config = { apiUrl, socketUrl };
const target = path.join(__dirname, '../public/config.json');

fs.writeFileSync(target, `${JSON.stringify(config, null, 2)}\n`);
console.log('config.json gerado para o build:', config);
