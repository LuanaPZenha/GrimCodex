const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const AppError = require('../utils/AppError');

async function authenticate(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token de autenticacao ausente', 401);
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch {
      throw new AppError('Token invalido ou expirado', 401);
    }

    const user = await User.findByPk(decoded.sub);
    if (!user) {
      throw new AppError('Usuario nao encontrado', 401);
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError('Nao autenticado', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Acesso negado', 403));
    }

    return next();
  };
}

module.exports = {
  authenticate,
  authorize,
};
