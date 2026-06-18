const { sequelize } = require('../src/config/database');
require('../src/models');
const Car = require('../src/models/Car');
const Moto = require('../src/models/Moto');
const MarcaRoupa = require('../src/models/MarcaRoupa');
const Item = require('../src/models/Item');
const Post = require('../src/models/Post');
const Reply = require('../src/models/Reply');
const ChatMessage = require('../src/models/ChatMessage');
const User = require('../src/models/User');

beforeAll(async () => {
  const { connectPostgres, syncPostgres } = require('../src/config/database');

  await connectPostgres();
  await syncPostgres(true);
});

beforeEach(async () => {
  await User.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  await Car.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  await Moto.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  await MarcaRoupa.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  await Reply.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  await Post.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  await ChatMessage.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  await Item.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
});

afterAll(async () => {
  await sequelize.close();
});
