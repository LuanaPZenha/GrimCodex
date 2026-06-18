const motoService = require('../services/motoService');

async function list(req, res, next) {
  try {
    const motos = await motoService.listMotos();
    res.json(motos);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const moto = await motoService.getMotoById(req.params.id);
    res.json(moto);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const moto = await motoService.createMoto(req.body);
    res.status(201).json(moto);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const moto = await motoService.updateMoto(req.params.id, req.body);
    res.json(moto);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await motoService.deleteMoto(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
