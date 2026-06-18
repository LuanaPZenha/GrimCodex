const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const identifier = req.body.username || req.body.login;
    const result = await authService.login(identifier, req.body.password);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function profile(req, res) {
  res.json({ user: req.user.toSafeJSON() });
}

module.exports = {
  register,
  login,
  profile,
};
