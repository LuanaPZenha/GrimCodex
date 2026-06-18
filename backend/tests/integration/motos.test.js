const { request, app, createTestUsers, loginAs, adminCredentials } = require('../helpers');

describe('Motos CRUD', () => {
  let token;

  beforeEach(async () => {
    await createTestUsers();
    token = await loginAs(adminCredentials.email, adminCredentials.password);
  });

  it('POST /api/motos cria moto', async () => {
    const response = await request(app)
      .post('/api/motos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        brand: 'Honda',
        model: 'CB500',
        year: 2024,
        engineCapacity: 500,
      });

    expect(response.status).toBe(201);
    expect(response.body.brand).toBe('Honda');
  });

  it('GET /api/motos lista motos', async () => {
    await request(app)
      .post('/api/motos')
      .set('Authorization', `Bearer ${token}`)
      .send({ brand: 'Yamaha', model: 'MT-07', year: 2023, engineCapacity: 689 });

    const response = await request(app)
      .get('/api/motos')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/motos/:id busca moto por ID', async () => {
    const created = await request(app)
      .post('/api/motos')
      .set('Authorization', `Bearer ${token}`)
      .send({ brand: 'Kawasaki', model: 'Ninja', year: 2022, engineCapacity: 400 });

    const response = await request(app)
      .get(`/api/motos/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.model).toBe('Ninja');
  });

  it('PUT /api/motos/:id atualiza moto', async () => {
    const created = await request(app)
      .post('/api/motos')
      .set('Authorization', `Bearer ${token}`)
      .send({ brand: 'Suzuki', model: 'GSX', year: 2021, engineCapacity: 250 });

    const response = await request(app)
      .put(`/api/motos/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ brand: 'Suzuki', model: 'GSX', year: 2022, engineCapacity: 250 });

    expect(response.status).toBe(200);
    expect(response.body.year).toBe(2022);
  });

  it('DELETE /api/motos/:id remove moto', async () => {
    const created = await request(app)
      .post('/api/motos')
      .set('Authorization', `Bearer ${token}`)
      .send({ brand: 'BMW', model: 'G310', year: 2020, engineCapacity: 310 });

    const response = await request(app)
      .delete(`/api/motos/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});
