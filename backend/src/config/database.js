const { Sequelize } = require('sequelize');
const config = require('./index');

const commonOptions = {
  logging: config.env === 'development' ? console.log : false,
  define: {
    underscored: true,
    timestamps: true,
  },
};

function createSequelize() {
  if (config.postgres.url) {
    return new Sequelize(config.postgres.url, {
      ...commonOptions,
      dialect: 'postgres',
      dialectOptions: config.postgres.ssl
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    });
  }

  return new Sequelize(
    config.postgres.database,
    config.postgres.username,
    config.postgres.password,
    {
      ...commonOptions,
      host: config.postgres.host,
      port: config.postgres.port,
      dialect: 'postgres',
    }
  );
}

const sequelize = createSequelize();

async function connectPostgres() {
  await sequelize.authenticate();
}

async function syncPostgres(force = false) {
  await sequelize.sync({ force, alter: false });
}

module.exports = {
  sequelize,
  connectPostgres,
  syncPostgres,
};
