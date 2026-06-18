const postService = require('../services/postService');

async function list(req, res, next) {
  try {
    const { category, search } = req.query;
    const posts = await postService.listPosts({ category, search });
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const result = await postService.getPostById(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const post = await postService.createPost(req.body, req.user);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const post = await postService.updatePost(req.params.id, req.body, req.user);
    res.json(post);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await postService.deletePost(req.params.id, req.user);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function addReply(req, res, next) {
  try {
    const reply = await postService.createReply(req.params.id, req.body, req.user);
    res.status(201).json(reply);
  } catch (error) {
    next(error);
  }
}

async function removeReply(req, res, next) {
  try {
    await postService.deleteReply(req.params.id, req.params.replyId, req.user);
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
  addReply,
  removeReply,
};
