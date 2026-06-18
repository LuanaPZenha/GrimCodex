const Car = require('../models/Car');
const AppError = require('../utils/AppError');

async function listCars() {
  return Car.findAll({ order: [['createdAt', 'DESC']] });
}

async function getCarById(id) {
  const car = await Car.findByPk(id);
  if (!car) {
    throw new AppError('Carro nao encontrado', 404);
  }
  return car;
}

async function createCar(data) {
  return Car.create(data);
}

async function updateCar(id, data) {
  const car = await getCarById(id);
  await car.update(data);
  return car;
}

async function deleteCar(id) {
  const car = await getCarById(id);
  await car.destroy();
}

module.exports = {
  listCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
