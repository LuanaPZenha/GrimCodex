const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

function mapRegisterData(data) {
  return {
    name: data.name,
    username: String(data.username || data.login).trim().toLowerCase(),
    email: data.email,
    password: data.password,
    platform: data.platform || data.plataforma || 'PC',
    favoriteClass: data.favoriteClass || data.classeFavorita || data.favorite_class || null,
    bio: data.bio || null,
    role: data.role || 'user',
  };
}

async function register(data) {
  const payload = mapRegisterData(data);

  const existingEmail = await User.findOne({ where: { email: payload.email } });
  if (existingEmail) {
    throw new AppError('Email ja cadastrado', 409);
  }

  const existingUsername = await User.findOne({ where: { username: payload.username } });
  if (existingUsername) {
    throw new AppError('Login ja em uso', 409);
  }

  const user = await User.create(payload);
  const token = signToken({ sub: user.id, role: user.role });
  return { user: user.toSafeJSON(), token };
}

async function login(identifier, password) {
  const username = String(identifier).trim().toLowerCase();
  const user = await User.findOne({ where: { username } });

  if (!user) {
    if (username.includes('@')) {
      throw new AppError('Use seu login (nome), nao o e-mail. Ex: admin, lilith', 401);
    }
    throw new AppError('Login nao encontrado. Verifique o nome cadastrado.', 401);
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    throw new AppError('Senha incorreta.', 401);
  }

  const token = signToken({ sub: user.id, role: user.role });
  return { user: user.toSafeJSON(), token };
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

async function updateUser(id, data, requester) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError('Usuario nao encontrado', 404);
  }

  if (requester.role !== 'admin' && requester.id !== user.id) {
    throw new AppError('Acesso negado', 403);
  }

  if (data.role && requester.role !== 'admin') {
    throw new AppError('Apenas administradores podem alterar roles', 403);
  }

  const updates = { ...data };
  if (updates.username) updates.username = String(updates.username).trim().toLowerCase();
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
  register,
  login,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};
