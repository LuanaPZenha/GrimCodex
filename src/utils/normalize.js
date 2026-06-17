import { getClassEmoji, getPlatformEmoji } from './registerGuide';

export function normalizeProfile(profile) {
  if (!profile) return null;
  const normalized = normalizeUser(profile);
  return {
    ...normalized,
    hoursPlayed: Number(profile.hoursPlayed ?? profile.horasJogadas ?? 0),
    achievementsCompleted: Number(profile.achievementsCompleted ?? profile.conquistasConcluidas ?? 0),
    mostUsedClass: profile.mostUsedClass || profile.classeMaisUsada || profile.favoriteClass || null,
    seasonsCompleted: Number(profile.seasonsCompleted ?? profile.temporadasConcluidas ?? 0),
    bossesDefeated: Number(profile.bossesDefeated ?? profile.chefesDerrotados ?? 0),
    mostUsedClassEmoji: getClassEmoji(profile.mostUsedClass || profile.classeMaisUsada || profile.favoriteClass),
  };
}

export function toStatsPayload(form) {
  return {
    hoursPlayed: Number(form.hoursPlayed),
    achievementsCompleted: Number(form.achievementsCompleted),
    mostUsedClass: form.mostUsedClass === 'Nenhuma' ? null : form.mostUsedClass,
    seasonsCompleted: Number(form.seasonsCompleted),
    bossesDefeated: Number(form.bossesDefeated),
  };
}

export function normalizeUser(user) {
  if (!user) return null;
  const role = String(user.role || user.perfil || 'user').toLowerCase();
  return {
    id: user.id,
    name: user.name || user.nome || '',
    username: user.username || user.login || '',
    email: user.email || '',
    platform: user.platform || user.plataforma || 'PC',
    favoriteClass: user.favoriteClass || user.classeFavorita || null,
    bio: user.bio || '',
    role,
    isAdmin: role === 'admin',
    platformEmoji: getPlatformEmoji(user.platform || user.plataforma),
    classEmoji: getClassEmoji(user.favoriteClass || user.classeFavorita),
  };
}

export function normalizeItem(item) {
  if (!item) return null;
  const id = item.id || item._id;
  return {
    id: typeof id === 'object' ? id.toString() : id,
    title: item.title || item.titulo || item.nome || '',
    category: item.category || item.categoria || item.plataforma || '',
    rating: Number(item.rating ?? item.nota ?? item.dificuldade ?? 1),
    rarity: String(item.rarity || item.raridade || 'COMUM').toUpperCase(),
    status: item.status || 'NA_FILA',
    description: item.description || item.descricao || '',
    guide: item.guide || item.guia || '',
    howTo: item.howTo || item.comoFazer || '',
    averageTime: item.averageTime || item.tempoMedio || '',
    location: item.location || item.localizacao || '',
    guideType: String(item.guideType || item.tipoGuia || 'CONQUISTA').toUpperCase(),
  };
}

export function toUserPayload(form) {
  const role = String(form.role || 'user').toLowerCase() === 'admin' ? 'admin' : 'user';
  const payload = {
    name: form.name,
    username: form.username,
    login: form.username,
    email: form.email,
    platform: form.platform,
    plataforma: form.platform,
    favoriteClass: form.favoriteClass === 'Nenhuma' ? null : form.favoriteClass,
    classeFavorita: form.favoriteClass === 'Nenhuma' ? null : form.favoriteClass,
    bio: form.bio || null,
    role,
  };
  if (form.password) {
    payload.password = form.password;
  }
  return payload;
}

export function toItemPayload(form) {
  return {
    title: form.title,
    category: form.category,
    rating: Number(form.rating),
    rarity: form.rarity || 'COMUM',
    status: form.status,
    description: form.description,
    guide: form.guide || '',
    howTo: form.howTo || '',
    averageTime: form.averageTime || '',
    location: form.location || '',
    guideType: form.guideType || 'CONQUISTA',
  };
}

export function normalizePost(post) {
  if (!post) return null;
  const id = post.id || post._id;
  return {
    id: typeof id === 'object' ? id.toString() : id,
    title: post.title || post.titulo || '',
    content: post.content || post.conteudo || '',
    category: String(post.category || post.categoria || 'GERAL').toUpperCase(),
    authorId: post.authorId,
    authorName: post.authorName || post.autorNome || '',
    authorUsername: post.authorUsername || post.autorLogin || '',
    replyCount: post.replyCount ?? post.respostas ?? 0,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

export function normalizeReply(reply) {
  if (!reply) return null;
  const id = reply.id || reply._id;
  return {
    id: typeof id === 'object' ? id.toString() : id,
    postId: reply.postId,
    content: reply.content || reply.conteudo || '',
    authorId: reply.authorId,
    authorName: reply.authorName || reply.autorNome || '',
    authorUsername: reply.authorUsername || reply.autorLogin || '',
    createdAt: reply.createdAt,
  };
}

export function toPostPayload(form) {
  return {
    title: form.title,
    content: form.content,
    category: form.category,
  };
}

export function toReplyPayload(content) {
  return { content };
}

export function normalizeChatMessage(message) {
  if (!message) return null;
  const id = message.id || message._id;
  return {
    id: typeof id === 'object' ? id.toString() : id,
    content: message.content || message.text || '',
    authorId: message.authorId,
    authorName: message.authorName || '',
    authorUsername: message.authorUsername || '',
    createdAt: message.createdAt,
  };
}

export function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.usuarios)) return data.usuarios;
  return [];
}

export function formatRole(role) {
  return String(role).toLowerCase() === 'admin' ? 'Admin' : 'Gamer';
}
