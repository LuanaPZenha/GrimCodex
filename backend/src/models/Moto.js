const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Moto = sequelize.define(
  'Moto',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1885,
        max: new Date().getFullYear() + 1,
      },
    },
    engineCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'engine_capacity',
      validate: { min: 50, max: 2500 },
    },
  },
  {
    tableName: 'motos',
  }
);

module.exports = Moto;
