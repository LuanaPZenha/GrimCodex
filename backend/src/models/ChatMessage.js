const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChatMessage = sequelize.define(
  'ChatMessage',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING(1000),
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
    room: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'sanctuary',
    },
  },
  {
    tableName: 'chat_messages',
    indexes: [
      { fields: ['room', 'created_at'] },
      { fields: ['author_id'] },
    ],
  }
);

module.exports = ChatMessage;
