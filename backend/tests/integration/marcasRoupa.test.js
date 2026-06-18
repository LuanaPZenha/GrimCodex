const { request, app, createTestUsers, loginAs, adminCredentials } = require('../helpers');

describe('Marcas de Roupa CRUD', () => {
  let token;

  beforeEach(async () => {
    await createTestUsers();
    token = await loginAs(adminCredentials.email, adminCredentials.password);
  });

  it('POST /api/marcas-roupa cria marca', async () => {
    const response = await request(app)
      .post('/api/marcas-roupa')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Nike',
        country: 'EUA',
        segment: 'Esportivo',
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Nike');
  });

  it('GET /api/marcas-roupa lista marcas', async () => {
    await request(app)
      .post('/api/marcas-roupa')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Adidas', country: 'Alemanha', segment: 'Casual' });

    const response = await request(app)
      .get('/api/marcas-roupa')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/marcas-roupa/:id busca marca por ID', async () => {
    const created = await request(app)
      .post('/api/marcas-roupa')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Zara', country: 'Espanha', segment: 'Fast Fashion' });

    const response = await request(app)
      .get(`/api/marcas-roupa/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Zara');
  });

  it('PUT /api/marcas-roupa/:id atualiza marca', async () => {
    const created = await request(app)
      .post('/api/marcas-roupa')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'H&M', country: 'Suecia', segment: 'Fast Fashion' });

    const response = await request(app)
      .put(`/api/marcas-roupa/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'H&M', country: 'Suecia', segment: 'Premium' });

    expect(response.status).toBe(200);
    expect(response.body.segment).toBe('Premium');
  });

  it('DELETE /api/marcas-roupa/:id remove marca', async () => {
    const created = await request(app)
      .post('/api/marcas-roupa')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Puma', country: 'Alemanha', segment: 'Esportivo' });

    const response = await request(app)
      .delete(`/api/marcas-roupa/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});
