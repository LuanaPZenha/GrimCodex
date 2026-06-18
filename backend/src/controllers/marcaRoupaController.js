const marcaRoupaService = require('../services/marcaRoupaService');

async function list(req, res, next) {
  try {
    const marcas = await marcaRoupaService.listMarcas();
    res.json(marcas);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const marca = await marcaRoupaService.getMarcaById(req.params.id);
    res.json(marca);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const marca = await marcaRoupaService.createMarca(req.body);
    res.status(201).json(marca);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const marca = await marcaRoupaService.updateMarca(req.params.id, req.body);
    res.json(marca);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await marcaRoupaService.deleteMarca(req.params.id);
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
