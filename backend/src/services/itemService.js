const { Op } = require('sequelize');
const Item = require('../models/Item');
const AppError = require('../utils/AppError');
const { RARITY_VALUES } = require('../data/rarity');
const { ACHIEVEMENT_CATEGORIES, ALL_ITEM_CATEGORIES, GUIDE_TYPES } = require('../data/categories');

function normalizeStatus(status) {
  const value = String(status || 'NA_FILA').toUpperCase().replace(/\s+/g, '_');
  if (['CONCLUIDO', 'ZERADO'].includes(value)) return 'CONCLUIDO';
  if (['EM_ANDAMENTO', 'JOGANDO', 'TENTANDO'].includes(value)) return 'EM_ANDAMENTO';
  return 'NA_FILA';
}

function normalizeRarity(value) {
  const key = String(value || 'COMUM').toUpperCase();
  return RARITY_VALUES.includes(key) ? key : 'COMUM';
}

function normalizeGuideType(value) {
  const key = String(value || 'CONQUISTA').toUpperCase();
  return GUIDE_TYPES.includes(key) ? key : 'CONQUISTA';
}

function normalizeCategory(value, guideType = 'CONQUISTA') {
  const key = String(value || 'Endgame').trim();
  if (ALL_ITEM_CATEGORIES.includes(key)) return key;
  if (guideType === 'MONTARIA') return 'Establo';
  if (guideType === 'MASCOTE') return 'Cosmetica';
  return 'Endgame';
}

function mapPayload(data) {
  const guideType = normalizeGuideType(data.guideType || data.tipoGuia);
  return {
    guideType,
    title: data.title || data.titulo,
    category: normalizeCategory(data.category || data.categoria || data.plataforma, guideType),
    rating: Number(data.rating ?? data.nota ?? data.dificuldade),
    rarity: normalizeRarity(data.rarity || data.raridade),
    status: normalizeStatus(data.status),
    description: data.description || data.descricao,
    guide: data.guide || data.guia || '',
    howTo: data.howTo || data.comoFazer || '',
    averageTime: data.averageTime || data.tempoMedio || '',
    location: data.location || data.localizacao || '',
  };
}

function buildWhere(filters = {}) {
  const where = {};
  const guideTypeFilter = filters.guideType || filters.tipoGuia;

  if (filters.rarity) {
    where.rarity = normalizeRarity(filters.rarity);
  } else if (filters.rareOnly === 'true' || filters.rareOnly === true) {
    where.rarity = { [Op.in]: ['PREMIUM', 'RARA', 'EPICA', 'LENDARIA', 'MITICA'] };
  }

  if (filters.category) {
    where.category = normalizeCategory(filters.category, guideTypeFilter);
  }

  if (guideTypeFilter) {
    const guideType = normalizeGuideType(guideTypeFilter);
    if (guideType === 'CONQUISTA') {
      where[Op.or] = [
        { guideType: 'CONQUISTA' },
        { guideType: null },
      ];
    } else {
      where.guideType = guideType;
    }
  }

  return where;
}

async function listItems(filters = {}) {
  return Item.findAll({
    where: buildWhere(filters),
    order: [['category', 'ASC'], ['createdAt', 'DESC']],
  });
}

async function getItemById(id) {
  const item = await Item.findByPk(id);
  if (!item) {
    throw new AppError('Conquista nao encontrada', 404);
  }
  return item;
}

async function createItem(data) {
  return Item.create(mapPayload(data));
}

async function updateItem(id, data) {
  const item = await getItemById(id);
  await item.update(mapPayload(data));
  return item;
}

async function deleteItem(id) {
  const item = await getItemById(id);
  await item.destroy();
}

module.exports = {
  listItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
