const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reply = sequelize.define(
  'Reply',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'post_id',
    },
    content: {
      type: DataTypes.STRING(3000),
      allowNull: false,
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
  },
  {
    tableName: 'replies',
    indexes: [
      { fields: ['post_id', 'created_at'] },
    ],
  }
);

module.exports = Reply;
