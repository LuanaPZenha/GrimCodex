const {
  request,
  app,
  createTestUsers,
  loginAs,
  adminCredentials,
  userCredentials,
} = require('../helpers');
const User = require('../../src/models/User');

describe('Users CRUD', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    await createTestUsers();
    adminToken = await loginAs(adminCredentials.email, adminCredentials.password);
    userToken = await loginAs(userCredentials.email, userCredentials.password);
  });

  it('GET /api/users lista usuarios para admin', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it('GET /api/users nega acesso para usuario comum', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(403);
  });

  it('POST /api/users cria usuario', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Criado Admin',
        email: 'criado@test.com',
        password: 'Criado123',
        role: 'user',
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('criado@test.com');
  });

  it('GET /api/users/:id busca usuario por ID', async () => {
    const user = await User.findOne({ where: { email: userCredentials.email } });

    const response = await request(app)
      .get(`/api/users/${user.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(userCredentials.email);
  });

  it('PUT /api/users/:id atualiza usuario', async () => {
    const user = await User.findOne({ where: { email: userCredentials.email } });

    const response = await request(app)
      .put(`/api/users/${user.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Usuario Atualizado' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Usuario Atualizado');
  });

  it('DELETE /api/users/:id remove usuario', async () => {
    const created = await User.create({
      name: 'Para Deletar',
      email: 'delete@test.com',
      password: 'Delete123',
      role: 'user',
    });

    const response = await request(app)
      .delete(`/api/users/${created.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(204);

    const deleted = await User.findByPk(created.id);
    expect(deleted).toBeNull();
  });
});
