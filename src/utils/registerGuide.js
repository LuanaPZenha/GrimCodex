export const PLATFORMS = [
  { value: 'PC', label: 'PC (Battle.net)', emoji: '🖥️' },
  { value: 'PS5', label: 'PlayStation 5', emoji: '🎮' },
  { value: 'Xbox', label: 'Xbox Series X|S', emoji: '🟢' },
  { value: 'Switch', label: 'Nintendo Switch', emoji: '🔴' },
  { value: 'Multiplataforma', label: 'Multiplataforma', emoji: '🌐' },
];

export const DIABLO_CLASSES = [
  { value: 'Barbarian', label: 'Bárbaro', emoji: '🔨' },
  { value: 'Druid', label: 'Druida', emoji: '🐺' },
  { value: 'Necromancer', label: 'Necromante', emoji: '💀' },
  { value: 'Rogue', label: 'Ladina', emoji: '🗡️' },
  { value: 'Sorcerer', label: 'Feiticeiro', emoji: '⚡' },
  { value: 'Spiritborn', label: 'Spiritborn', emoji: '🥋' },
  { value: 'Nenhuma', label: 'Ainda não decidi', emoji: '❓' },
];

export const REGISTER_GUIDE = [
  {
    field: 'name',
    emoji: '🧙',
    title: 'Nome completo',
    tip: 'Use seu nome ou apelido de Santuário. Aparece no perfil e nas saudações do Grim Codex.',
    example: 'Ex: Lilith Hunter',
  },
  {
    field: 'username',
    emoji: '🔑',
    title: 'Login',
    tip: 'Seu nome de acesso — apenas letras (pode usar . _ -). Deve ser único: não pode repetir login de outro usuário.',
    example: 'Ex: lilith, necro, barbaro',
  },
  {
    field: 'email',
    emoji: '📧',
    title: 'E-mail',
    tip: 'Usado para recuperação e contato. Diferente do login — aqui precisa ser um e-mail válido.',
    example: 'Ex: gamer@sanctuary.net',
  },
  {
    field: 'password',
    emoji: '🔒',
    title: 'Senha',
    tip: 'Mínimo 8 caracteres com maiúscula, minúscula e número. Nunca compartilhe sua senha.',
    example: 'Ex: Sanctuary2024!',
  },
  {
    field: 'platform',
    emoji: '🎮',
    title: 'Plataforma',
    tip: 'Onde você joga Diablo IV. Ajuda a filtrar conquistas e builds por plataforma.',
    example: 'PC, PS5, Xbox...',
  },
  {
    field: 'favoriteClass',
    emoji: '⚔️',
    title: 'Classe favorita',
    tip: 'Opcional. Sua classe principal para reviews e guias personalizados.',
    example: 'Necromancer, Barbarian...',
  },
  {
    field: 'bio',
    emoji: '📜',
    title: 'Bio / Sobre você',
    tip: 'Opcional. Conte seu estilo de jogo, main build ou meta que está perseguindo.',
    example: 'Ex: Main necro bone spear — farmando Uber Lilith',
  },
];

export function getPlatformEmoji(platform) {
  return PLATFORMS.find((p) => p.value === platform)?.emoji || '🎮';
}

export function getClassEmoji(className) {
  return DIABLO_CLASSES.find((c) => c.value === className)?.emoji || '⚔️';
}
