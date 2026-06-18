const Moto = require('../models/Moto');
const AppError = require('../utils/AppError');

async function listMotos() {
  return Moto.findAll({ order: [['createdAt', 'DESC']] });
}

async function getMotoById(id) {
  const moto = await Moto.findByPk(id);
  if (!moto) {
    throw new AppError('Moto nao encontrada', 404);
  }
  return moto;
}

async function createMoto(data) {
  return Moto.create(data);
}

async function updateMoto(id, data) {
  const moto = await getMotoById(id);
  await moto.update(data);
  return moto;
}

async function deleteMoto(id) {
  const moto = await getMotoById(id);
  await moto.destroy();
}

module.exports = {
  listMotos,
  getMotoById,
  createMoto,
  updateMoto,
  deleteMoto,
};
