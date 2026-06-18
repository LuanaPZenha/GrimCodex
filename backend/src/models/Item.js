const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { RARITY_VALUES } = require('../data/rarity');
const { ALL_ITEM_CATEGORIES, GUIDE_TYPES } = require('../data/categories');

const STATUS_VALUES = ['CONCLUIDO', 'EM_ANDAMENTO', 'NA_FILA'];

const Item = sequelize.define(
  'Item',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    guideType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'CONQUISTA',
      field: 'guide_type',
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    rarity: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'COMUM',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'NA_FILA',
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    guide: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    howTo: {
      type: DataTypes.STRING(2000),
      allowNull: false,
      defaultValue: '',
      field: 'how_to',
    },
    averageTime: {
      type: DataTypes.STRING(120),
      allowNull: false,
      defaultValue: '',
      field: 'average_time',
    },
    location: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    tableName: 'items',
    indexes: [
      { fields: ['guide_type'] },
      { fields: ['category'] },
      { fields: ['title', 'guide_type'] },
    ],
  }
);

module.exports = Item;
module.exports.STATUS_VALUES = STATUS_VALUES;
module.exports.RARITY_VALUES = RARITY_VALUES;
module.exports.GUIDE_TYPES = GUIDE_TYPES;
module.exports.ALL_ITEM_CATEGORIES = ALL_ITEM_CATEGORIES;
