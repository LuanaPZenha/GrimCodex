const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CATEGORY_VALUES = ['DUVIDAS', 'BUILDS', 'ENDGAME', 'GERAL', 'CONQUISTAS'];

const Post = sequelize.define(
  'Post',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(5000),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'GERAL',
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'author_id',
    },
    authorName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'author_name',
    },
    authorUsername: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'author_username',
    },
    replyCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'reply_count',
      validate: { min: 0 },
    },
  },
  {
    tableName: 'posts',
    indexes: [
      { fields: ['created_at'] },
      { fields: ['category', 'created_at'] },
      { fields: ['author_id'] },
    ],
  }
);

module.exports = Post;
module.exports.CATEGORY_VALUES = CATEGORY_VALUES;
