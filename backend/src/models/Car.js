const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Car = sequelize.define(
  'Car',
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
        min: 1886,
        max: new Date().getFullYear() + 1,
      },
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: 'cars',
  }
);

module.exports = Car;
