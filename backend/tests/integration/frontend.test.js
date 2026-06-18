const { request, app } = require('../helpers');

describe('Frontend', () => {
  it('GET / retorna o painel HTML', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Painel de Testes');
  });

  it('GET /app.js retorna o script do frontend', async () => {
    const response = await request(app).get('/app.js');

    expect(response.status).toBe(200);
    expect(response.text).toContain('setupAuth');
  });
});
