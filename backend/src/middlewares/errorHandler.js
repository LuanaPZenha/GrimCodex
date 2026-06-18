const AppError = require('../utils/AppError');

function notFoundHandler(_req, _res, next) {
  next(new AppError('Rota nao encontrada', 404));
}

function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const response = {
    message: err.message || 'Erro interno do servidor',
  };

  if (err.errors) {
    response.errors = err.errors;
  }

  if (process.env.NODE_ENV !== 'production' && !err.isOperational) {
    response.stack = err.stack;
  }

  if (err.name === 'ValidationError') {
    response.message = 'Erro de validacao';
    response.errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json(response);
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Identificador invalido' });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'Registro duplicado' });
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
