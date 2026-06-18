const { request, app, createTestUsers, loginAs, adminCredentials } = require('../helpers');

describe('Cars CRUD', () => {
  let token;
  let carId;

  beforeEach(async () => {
    await createTestUsers();
    token = await loginAs(adminCredentials.email, adminCredentials.password);
  });

  it('POST /api/cars cria carro', async () => {
    const response = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${token}`)
      .send({
        brand: 'Toyota',
        model: 'Corolla',
        year: 2024,
        color: 'Prata',
      });

    expect(response.status).toBe(201);
    expect(response.body.brand).toBe('Toyota');
    carId = response.body.id;
  });

  it('GET /api/cars lista carros', async () => {
    await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${token}`)
      .send({ brand: 'Honda', model: 'Civic', year: 2023, color: 'Preto' });

    const response = await request(app)
      .get('/api/cars')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/cars/:id busca carro por ID', async () => {
    const created = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${token}`)
      .send({ brand: 'Ford', model: 'Ka', year: 2022, color: 'Branco' });

    const response = await request(app)
      .get(`/api/cars/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.model).toBe('Ka');
  });

  it('PUT /api/cars/:id atualiza carro', async () => {
    const created = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${token}`)
      .send({ brand: 'VW', model: 'Gol', year: 2021, color: 'Azul' });

    const response = await request(app)
      .put(`/api/cars/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ brand: 'VW', model: 'Gol', year: 2021, color: 'Vermelho' });

    expect(response.status).toBe(200);
    expect(response.body.color).toBe('Vermelho');
  });

  it('DELETE /api/cars/:id remove carro', async () => {
    const created = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${token}`)
      .send({ brand: 'Fiat', model: 'Uno', year: 2020, color: 'Verde' });

    const response = await request(app)
      .delete(`/api/cars/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it('GET /api/cars rejeita sem autenticacao', async () => {
    const response = await request(app).get('/api/cars');
    expect(response.status).toBe(401);
  });
});
