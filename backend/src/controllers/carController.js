const carService = require('../services/carService');

async function list(req, res, next) {
  try {
    const cars = await carService.listCars();
    res.json(cars);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const car = await carService.getCarById(req.params.id);
    res.json(car);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const car = await carService.createCar(req.body);
    res.status(201).json(car);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const car = await carService.updateCar(req.params.id, req.body);
    res.json(car);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await carService.deleteCar(req.params.id);
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
