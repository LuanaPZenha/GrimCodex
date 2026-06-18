const { Op } = require('sequelize');
const Post = require('../models/Post');
const Reply = require('../models/Reply');
const AppError = require('../utils/AppError');

function authorSnapshot(user) {
  return {
    authorId: user.id,
    authorName: user.name,
    authorUsername: user.username,
  };
}

function mapPostPayload(data) {
  return {
    title: data.title || data.titulo,
    content: data.content || data.conteudo,
    category: String(data.category || data.categoria || 'GERAL').toUpperCase(),
  };
}

function canManageResource(user, resourceAuthorId) {
  return user.role === 'admin' || user.id === resourceAuthorId;
}

async function listPosts(filters = {}) {
  const where = {};

  if (filters.category) {
    where.category = String(filters.category).toUpperCase();
  }

  if (filters.search) {
    const term = String(filters.search).trim();
    if (term) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${term}%` } },
        { content: { [Op.iLike]: `%${term}%` } },
      ];
    }
  }

  return Post.findAll({ where, order: [['createdAt', 'DESC']] });
}

async function getPostById(id) {
  const post = await Post.findByPk(id);
  if (!post) {
    throw new AppError('Topico nao encontrado', 404);
  }

  const replies = await Reply.findAll({
    where: { postId: id },
    order: [['createdAt', 'ASC']],
  });
  return { post, replies };
}

async function createPost(data, user) {
  const payload = mapPostPayload(data);
  return Post.create({
    ...payload,
    ...authorSnapshot(user),
  });
}

async function updatePost(id, data, user) {
  const post = await Post.findByPk(id);
  if (!post) {
    throw new AppError('Topico nao encontrado', 404);
  }

  if (!canManageResource(user, post.authorId)) {
    throw new AppError('Acesso negado', 403);
  }

  const payload = mapPostPayload(data);
  await post.update(payload);
  return post;
}

async function deletePost(id, user) {
  const post = await Post.findByPk(id);
  if (!post) {
    throw new AppError('Topico nao encontrado', 404);
  }

  if (!canManageResource(user, post.authorId)) {
    throw new AppError('Acesso negado', 403);
  }

  await Reply.destroy({ where: { postId: id } });
  await post.destroy();
}

async function createReply(postId, data, user) {
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new AppError('Topico nao encontrado', 404);
  }

  const content = data.content || data.conteudo;
  const reply = await Reply.create({
    postId,
    content,
    ...authorSnapshot(user),
  });

  await post.update({ replyCount: post.replyCount + 1 });
  return reply;
}

async function deleteReply(postId, replyId, user) {
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new AppError('Topico nao encontrado', 404);
  }

  const reply = await Reply.findOne({ where: { id: replyId, postId } });
  if (!reply) {
    throw new AppError('Resposta nao encontrada', 404);
  }

  const canDelete =
    user.role === 'admin'
    || user.id === reply.authorId
    || user.id === post.authorId;

  if (!canDelete) {
    throw new AppError('Acesso negado', 403);
  }

  await reply.destroy();
  await post.update({ replyCount: Math.max(0, post.replyCount - 1) });
}

module.exports = {
  listPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  createReply,
  deleteReply,
};
