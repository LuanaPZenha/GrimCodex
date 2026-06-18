const { request, app, createTestUsers, loginAs, adminCredentials, userCredentials } = require('../helpers');

describe('Health', () => {
  it('GET /health retorna status ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.timestamp).toBeDefined();
  });
});

describe('Auth', () => {
  beforeEach(async () => {
    await createTestUsers();
  });

  it('POST /api/auth/register cria usuario e retorna token', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Novo Usuario',
      email: 'novo@test.com',
      password: 'Novo1234',
    });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('novo@test.com');
    expect(response.body.user.password).toBeUndefined();
  });

  it('POST /api/auth/login autentica com credenciais validas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: adminCredentials.email, password: adminCredentials.password });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.role).toBe('admin');
  });

  it('POST /api/auth/login rejeita credenciais invalidas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: adminCredentials.email, password: 'wrongpass' });

    expect(response.status).toBe(401);
  });

  it('GET /api/auth/profile retorna perfil autenticado', async () => {
    const token = await loginAs(userCredentials.email, userCredentials.password);

    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe(userCredentials.email);
  });

  it('GET /api/auth/profile rejeita requisicao sem token', async () => {
    const response = await request(app).get('/api/auth/profile');

    expect(response.status).toBe(401);
  });
});
