const MarcaRoupa = require('../models/MarcaRoupa');
const AppError = require('../utils/AppError');

async function listMarcas() {
  return MarcaRoupa.findAll({ order: [['createdAt', 'DESC']] });
}

async function getMarcaById(id) {
  const marca = await MarcaRoupa.findByPk(id);
  if (!marca) {
    throw new AppError('Marca de roupa nao encontrada', 404);
  }
  return marca;
}

async function createMarca(data) {
  return MarcaRoupa.create(data);
}

async function updateMarca(id, data) {
  const marca = await getMarcaById(id);
  await marca.update(data);
  return marca;
}

async function deleteMarca(id) {
  const marca = await getMarcaById(id);
  await marca.destroy();
}

module.exports = {
  listMarcas,
  getMarcaById,
  createMarca,
  updateMarca,
  deleteMarca,
};
