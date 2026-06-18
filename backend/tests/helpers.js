const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

const adminCredentials = {
  name: 'Admin Test',
  email: 'admin@test.com',
  password: 'Admin1234',
  role: 'admin',
};

const userCredentials = {
  name: 'User Test',
  email: 'user@test.com',
  password: 'User1234',
  role: 'user',
};

async function createTestUsers() {
  await User.create(adminCredentials);
  await User.create(userCredentials);
}

async function loginAs(email, password) {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  return response.body.token;
}

module.exports = {
  request,
  app,
  adminCredentials,
  userCredentials,
  createTestUsers,
  loginAs,
};
