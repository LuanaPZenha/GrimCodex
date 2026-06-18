const User = require('../models/User');
const AppError = require('../utils/AppError');

function mapUserData(data) {
  return {
    name: data.name,
    username: String(data.username || data.login || '').trim().toLowerCase(),
    email: data.email,
    password: data.password,
    platform: data.platform || data.plataforma || 'PC',
    favoriteClass: data.favoriteClass || data.classeFavorita || null,
    bio: data.bio || null,
    role: data.role || 'user',
  };
}

async function listUsers() {
  const users = await User.findAll({ order: [['id', 'ASC']] });
  return users.map((u) => u.toSafeJSON());
}

async function getUserById(id) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError('Usuario nao encontrado', 404);
  }
  return user.toSafeJSON();
}

async function createUser(data) {
  const payload = mapUserData(data);

  if (!payload.username) {
    throw new AppError('Login obrigatorio', 400);
  }

  const existingEmail = await User.findOne({ where: { email: payload.email } });
  if (existingEmail) {
    throw new AppError('Email ja cadastrado', 409);
  }

  const existingUsername = await User.findOne({ where: { username: payload.username } });
  if (existingUsername) {
    throw new AppError('Login ja em uso', 409);
  }

  const user = await User.create(payload);
  return user.toSafeJSON();
}

async function updateUser(id, data) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError('Usuario nao encontrado', 404);
  }

  const updates = { ...data };
  if (updates.login) {
    updates.username = String(updates.login).trim().toLowerCase();
    delete updates.login;
  }
  if (updates.plataforma) {
    updates.platform = updates.plataforma;
    delete updates.plataforma;
  }
  if (updates.classeFavorita) {
    updates.favoriteClass = updates.classeFavorita;
    delete updates.classeFavorita;
  }
  if (updates.username) {
    updates.username = String(updates.username).trim().toLowerCase();
  }

  if (updates.username && updates.username !== user.username) {
    const taken = await User.findOne({ where: { username: updates.username } });
    if (taken) throw new AppError('Login ja em uso', 409);
  }

  if (updates.email && updates.email !== user.email) {
    const taken = await User.findOne({ where: { email: updates.email } });
    if (taken) throw new AppError('Email ja cadastrado', 409);
  }

  await user.update(updates);
  return user.toSafeJSON();
}

async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError('Usuario nao encontrado', 404);
  }
  await user.destroy();
}

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
