const config = require('../config');

function resolveCorsOrigin(origin, callback) {
  const allowed = config.corsOrigin;

  if (allowed === '*') {
    callback(null, true);
    return;
  }

  if (Array.isArray(allowed)) {
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origem nao permitida pelo CORS'));
    return;
  }

  if (!origin || origin === allowed) {
    callback(null, true);
    return;
  }

  callback(new Error('Origem nao permitida pelo CORS'));
}

function getSocketCorsOrigin() {
  const allowed = config.corsOrigin;
  if (allowed === '*') return true;
  return allowed;
}

module.exports = {
  resolveCorsOrigin,
  getSocketCorsOrigin,
};
