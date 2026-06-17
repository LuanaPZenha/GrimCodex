import api from './api';

export const authService = {
  async login(credentials) {
    const { data } = await api.post('/auth/login', {
      username: credentials.username || credentials.login,
      login: credentials.login || credentials.username,
      password: credentials.password,
    });
    return data;
  },

  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  async me() {
    const { data } = await api.get('/auth/profile');
    return data;
  },
};

export const usersService = {
  async list() {
    const { data } = await api.get('/users');
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/users', payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/users/${id}`, payload);
    return data;
  },

  async remove(id) {
    await api.delete(`/users/${id}`);
  },
};

export const itemsService = {
  async list(params = {}) {
    const { data } = await api.get('/items', { params });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/items/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/items', payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/items/${id}`, payload);
    return data;
  },

  async remove(id) {
    await api.delete(`/items/${id}`);
  },
};

export const postsService = {
  async list(params = {}) {
    const { data } = await api.get('/posts', { params });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/posts/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/posts', payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/posts/${id}`, payload);
    return data;
  },

  async remove(id) {
    await api.delete(`/posts/${id}`);
  },

  async addReply(postId, payload) {
    const { data } = await api.post(`/posts/${postId}/replies`, payload);
    return data;
  },

  async removeReply(postId, replyId) {
    await api.delete(`/posts/${postId}/replies/${replyId}`);
  },
};

export const chatService = {
  async getMessages(limit = 50) {
    const { data } = await api.get('/chat/messages', { params: { limit } });
    return data;
  },
};

export const profilesService = {
  async list() {
    const { data } = await api.get('/profiles');
    return data;
  },

  async me() {
    const { data } = await api.get('/profiles/me');
    return data;
  },

  async getByUsername(username) {
    const { data } = await api.get(`/profiles/${username}`);
    return data;
  },

  async updateStats(payload) {
    const { data } = await api.put('/profiles/me/stats', payload);
    return data;
  },
};
