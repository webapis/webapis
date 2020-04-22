require('babel-polyfill');

import httpRoute from '../../http-route';
const request = require('supertest');

describe('Recover', () => {
  it(' empty email emailInvalid:407', (done) => {
    debugger;
    request(httpRoute)
      .post('/auth/requestpasschange')
      .send({ email: '' })
      .set('Accept', 'application/json')
      .expect(400, { errors: ['407'] })
      .end(done); //
  });
  it('email is not registered emailIsNotRegistered:408', (done) => {
    debugger;
    global.findOne = null;
    request(httpRoute)
      .post('/auth/requestpasschange')
      .send({ email: 'test@gmail.com' })
      .set('Accept', 'application/json')
      .expect(400, { errors: ['408'] })
      .end(done); //
  });
  it('request password change accepted', (done) => {
    debugger;
    global.findOne = { password: '123', _id: '123' }; //mongodb
    global.sign = 'test'; //jwt
    process.env.email = 'webapis.github@gmail.com';
    process.env.password = 'Dragonfly1977!';
    process.env.secret = 'testsecret';
    process.env.resetUrl = 'http://localhost:3000/auth/changepath';
    request(httpRoute)
      .post('/auth/requestpasschange')
      .send({ email: 'test@gmail.com' })
      .set('Accept', 'application/json')
      .expect(200)
      .end(done); //
  });
});
