const itemService = require('../services/itemService');

async function list(req, res, next) {
  try {
    const items = await itemService.listItems(req.query);
    res.json(items);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const item = await itemService.getItemById(req.params.id);
    res.json(item);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const item = await itemService.createItem(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const item = await itemService.updateItem(req.params.id, req.body);
    res.json(item);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await itemService.deleteItem(req.params.id);
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
