const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MarcaRoupa = sequelize.define(
  'MarcaRoupa',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    country: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    segment: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
  },
  {
    tableName: 'marcas_roupa',
  }
);

module.exports = MarcaRoupa;
