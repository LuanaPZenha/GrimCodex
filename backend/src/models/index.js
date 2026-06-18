const User = require('./User');
const Item = require('./Item');
const Post = require('./Post');
const Reply = require('./Reply');
const ChatMessage = require('./ChatMessage');
const Car = require('./Car');
const Moto = require('./Moto');
const MarcaRoupa = require('./MarcaRoupa');

Post.hasMany(Reply, { foreignKey: 'postId', as: 'replies', onDelete: 'CASCADE' });
Reply.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

module.exports = {
  User,
  Item,
  Post,
  Reply,
  ChatMessage,
  Car,
  Moto,
  MarcaRoupa,
};
