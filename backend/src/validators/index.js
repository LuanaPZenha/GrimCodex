const { body, param } = require('express-validator');

const idParam = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
];

const replyIdParam = [
  param('replyId').isInt({ min: 1 }).withMessage('ID invalido'),
];

const USERNAME_REGEX = /^[a-zA-ZÀ-ÿ]+([._-]?[a-zA-ZÀ-ÿ]+)*$/;

const usernameRule = (field) =>
  body(field)
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Login deve ter entre 2 e 50 caracteres')
    .matches(USERNAME_REGEX)
    .withMessage('Login deve conter apenas letras (pode usar . _ - entre nomes)');

const userCreateRules = [
  body('name').trim().notEmpty().isLength({ max: 100 }).withMessage('Nome obrigatorio'),
  usernameRule('username'),
  usernameRule('login'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Email invalido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Senha deve ter no minimo 8 caracteres')
    .matches(/[A-Z]/)
    .withMessage('Senha deve conter letra maiuscula')
    .matches(/[a-z]/)
    .withMessage('Senha deve conter letra minuscula')
    .matches(/[0-9]/)
    .withMessage('Senha deve conter numero'),
  body('platform').optional().trim().isIn(['PC', 'PS5', 'Xbox', 'Switch', 'Multiplataforma']),
  body('plataforma').optional().trim().isIn(['PC', 'PS5', 'Xbox', 'Switch', 'Multiplataforma']),
  body('favoriteClass').optional().trim().isLength({ max: 30 }),
  body('classeFavorita').optional().trim().isLength({ max: 30 }),
  body('bio').optional().trim().isLength({ max: 300 }),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role invalida'),
  body().custom((value) => {
    if (!value.username && !value.login) {
      throw new Error('Login obrigatorio');
    }
    return true;
  }),
];

const registerRules = [
  body('name').trim().notEmpty().isLength({ max: 100 }).withMessage('Nome obrigatorio'),
  usernameRule('username'),
  usernameRule('login'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Email invalido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Senha deve ter no minimo 8 caracteres')
    .matches(/[A-Z]/)
    .withMessage('Senha deve conter letra maiuscula')
    .matches(/[a-z]/)
    .withMessage('Senha deve conter letra minuscula')
    .matches(/[0-9]/)
    .withMessage('Senha deve conter numero'),
  body('platform').optional().trim().isIn(['PC', 'PS5', 'Xbox', 'Switch', 'Multiplataforma']),
  body('plataforma').optional().trim().isIn(['PC', 'PS5', 'Xbox', 'Switch', 'Multiplataforma']),
  body('favoriteClass').optional().trim().isLength({ max: 30 }),
  body('classeFavorita').optional().trim().isLength({ max: 30 }),
  body('bio').optional().trim().isLength({ max: 300 }),
  body().custom((value) => {
    if (!value.username && !value.login) throw new Error('Login obrigatorio');
    if (!value.platform && !value.plataforma) throw new Error('Plataforma obrigatoria');
    return true;
  }),
];

const userUpdateRules = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  body('name').optional().trim().notEmpty().isLength({ max: 100 }),
  usernameRule('username'),
  usernameRule('login'),
  body('email').optional().trim().isEmail().normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[a-z]/)
    .matches(/[0-9]/),
  body('platform').optional().trim().isIn(['PC', 'PS5', 'Xbox', 'Switch', 'Multiplataforma']),
  body('plataforma').optional().trim().isIn(['PC', 'PS5', 'Xbox', 'Switch', 'Multiplataforma']),
  body('favoriteClass').optional().trim().isLength({ max: 30 }),
  body('classeFavorita').optional().trim().isLength({ max: 30 }),
  body('bio').optional().trim().isLength({ max: 300 }),
  body('role').optional().isIn(['user', 'admin']),
];

const loginRules = [
  body('password').notEmpty().withMessage('Senha obrigatoria'),
  body().custom((value) => {
    const login = String(value.username || value.login || '').trim();
    if (!login) {
      throw new Error('Informe seu login');
    }
    if (login.includes('@')) {
      throw new Error('Use seu login (nome), nao o e-mail');
    }
    if (login.length < 2) {
      throw new Error('Login deve ter no minimo 2 caracteres');
    }
    return true;
  }),
];

const carRules = [
  body('brand').trim().notEmpty().isLength({ max: 100 }),
  body('model').trim().notEmpty().isLength({ max: 100 }),
  body('year').isInt({ min: 1886, max: new Date().getFullYear() + 1 }),
  body('color').trim().notEmpty().isLength({ max: 50 }),
];

const motoRules = [
  body('brand').trim().notEmpty().isLength({ max: 100 }),
  body('model').trim().notEmpty().isLength({ max: 100 }),
  body('year').isInt({ min: 1885, max: new Date().getFullYear() + 1 }),
  body('engineCapacity').isInt({ min: 50, max: 2500 }),
];

const marcaRoupaRules = [
  body('name').trim().notEmpty().isLength({ max: 100 }),
  body('country').trim().notEmpty().isLength({ max: 80 }),
  body('segment').trim().notEmpty().isLength({ max: 80 }),
];

const { RARITY_VALUES } = require('../data/rarity');
const { ALL_ITEM_CATEGORIES, GUIDE_TYPES } = require('../data/categories');

const itemRules = [
  body('title').optional().trim().notEmpty().isLength({ max: 150 }),
  body('titulo').optional().trim().notEmpty().isLength({ max: 150 }),
  body('guideType').optional().trim().isIn(GUIDE_TYPES),
  body('tipoGuia').optional().trim().isIn(GUIDE_TYPES),
  body('category').optional().trim().isIn(ALL_ITEM_CATEGORIES),
  body('categoria').optional().trim().isIn(ALL_ITEM_CATEGORIES),
  body('plataforma').optional().trim().isIn(ALL_ITEM_CATEGORIES),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('nota').optional().isInt({ min: 1, max: 5 }),
  body('dificuldade').optional().isInt({ min: 1, max: 5 }),
  body('rarity').optional().trim().isIn(RARITY_VALUES),
  body('raridade').optional().trim().isIn(RARITY_VALUES),
  body('status').optional().isIn(['CONCLUIDO', 'EM_ANDAMENTO', 'NA_FILA', 'ZERADO', 'JOGANDO', 'TENTANDO']),
  body('description').optional().trim().notEmpty().isLength({ max: 500 }),
  body('descricao').optional().trim().notEmpty().isLength({ max: 500 }),
  body('guide').optional().trim().isLength({ max: 8000 }),
  body('guia').optional().trim().isLength({ max: 8000 }),
  body().custom((value) => {
    const title = value.title || value.titulo;
    const category = value.category || value.categoria || value.plataforma;
    const rating = value.rating ?? value.nota ?? value.dificuldade;
    const description = value.description || value.descricao;

    if (!title) throw new Error('Titulo obrigatorio');
    if (!category) throw new Error('Categoria obrigatoria');
    if (rating === undefined || rating === null) throw new Error('Nota obrigatoria');
    if (!description) throw new Error('Descricao obrigatoria');
    return true;
  }),
];

const POST_CATEGORIES = ['DUVIDAS', 'BUILDS', 'ENDGAME', 'GERAL', 'CONQUISTAS'];

const postRules = [
  body('title').optional().trim().notEmpty().isLength({ max: 200 }).withMessage('Titulo obrigatorio'),
  body('titulo').optional().trim().notEmpty().isLength({ max: 200 }),
  body('content').optional().trim().notEmpty().isLength({ max: 5000 }).withMessage('Conteudo obrigatorio'),
  body('conteudo').optional().trim().notEmpty().isLength({ max: 5000 }),
  body('category').optional().trim().isIn(POST_CATEGORIES).withMessage('Categoria invalida'),
  body('categoria').optional().trim().isIn(POST_CATEGORIES),
  body().custom((value) => {
    const title = value.title || value.titulo;
    const content = value.content || value.conteudo;
    if (!title) throw new Error('Titulo obrigatorio');
    if (!content) throw new Error('Conteudo obrigatorio');
    return true;
  }),
];

const postUpdateRules = [
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('titulo').optional().trim().notEmpty().isLength({ max: 200 }),
  body('content').optional().trim().notEmpty().isLength({ max: 5000 }),
  body('conteudo').optional().trim().notEmpty().isLength({ max: 5000 }),
  body('category').optional().trim().isIn(POST_CATEGORIES),
  body('categoria').optional().trim().isIn(POST_CATEGORIES),
];

const replyRules = [
  body('content').optional().trim().notEmpty().isLength({ max: 3000 }).withMessage('Resposta obrigatoria'),
  body('conteudo').optional().trim().notEmpty().isLength({ max: 3000 }),
  body().custom((value) => {
    if (!value.content && !value.conteudo) throw new Error('Resposta obrigatoria');
    return true;
  }),
];

const usernameParamRules = [
  param('username')
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 50 })
    .matches(USERNAME_REGEX)
    .withMessage('Login invalido'),
];

const profileStatsRules = [
  body('hoursPlayed').optional().isInt({ min: 0, max: 99999 }),
  body('horasJogadas').optional().isInt({ min: 0, max: 99999 }),
  body('achievementsCompleted').optional().isInt({ min: 0, max: 9999 }),
  body('conquistasConcluidas').optional().isInt({ min: 0, max: 9999 }),
  body('mostUsedClass').optional().trim().isIn(['Barbarian', 'Druid', 'Necromancer', 'Rogue', 'Sorcerer', 'Spiritborn', 'Nenhuma', null, '']),
  body('classeMaisUsada').optional().trim().isIn(['Barbarian', 'Druid', 'Necromancer', 'Rogue', 'Sorcerer', 'Spiritborn', 'Nenhuma', null, '']),
  body('seasonsCompleted').optional().isInt({ min: 0, max: 99 }),
  body('temporadasConcluidas').optional().isInt({ min: 0, max: 99 }),
  body('bossesDefeated').optional().isInt({ min: 0, max: 9999 }),
  body('chefesDerrotados').optional().isInt({ min: 0, max: 9999 }),
];

module.exports = {
  idParam,
  replyIdParam,
  mongoIdParam: idParam,
  mongoReplyIdParam: replyIdParam,
  userCreateRules,
  registerRules,
  userUpdateRules,
  loginRules,
  carRules,
  motoRules,
  marcaRoupaRules,
  itemRules,
  postRules,
  postUpdateRules,
  replyRules,
  usernameParamRules,
  profileStatsRules,
};
