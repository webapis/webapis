require('babel-polyfill');

import httpRoute from '../../http-route';
const request = require('supertest');
describe('login.test.js', () => {
  it('empty useroremail and password 410,409', (done) => {
    debugger;
    request(httpRoute)
      .get('/auth/login/')
      .set('Accept', 'application/json')
      .set('authorization', 'Basic Og==')
      .expect(400, { errors: ['410', '409'] })
      .end(done);
  });
  it('emailorusernameNotValid 410', (done) => {
    request(httpRoute)
      .get('/auth/login')
      .set('Accept', 'application/json')
      .set('authorization', 'Basic MjMzMzpEcmFnb25kRkZGbHkh')
      .expect(400, { errors: ['410'] })
      .end(done);
  });

  it('emailIsNotRegistered 401', (done) => {
    global.findOne = null;

    request(httpRoute)
      .get('/auth/login')
      .set('Accept', 'application/json')
      .set('authorization', 'Basic dGVzdEBnbWFpbC5jb206RHJhZ29uZEZGRmx5IQ==')
      .expect(400, { errors: ['401'] })
      .end(done);
  });
  it('usernameIsNotRegistered 411', (done) => {
    global.findOne = null;

    request(httpRoute)
      .get('/auth/login')
      .set('Accept', 'application/json')
      .set('authorization', 'Basic dGttaG91c2U6RHJhZ29uZEZGRmx5IQ==')
      .expect(400, { errors: ['411'] })
      .end(done);
  });

  it('valid username wrong password 411', (done) => {
    global.findOne = { password: '123' }; //mongodb
    global.compare = false; //bcrypt

    request(httpRoute)
      .get('/auth/login')
      .set('Accept', 'application/json')
      .set('authorization', 'Basic dGttaG91c2U6RHJhZ29uZEZGRmx5IQ==')
      .expect(400, { errors: ['401'] })
      .end(done);
  });

  it('valid email  and wrong password', (done) => {
    global.findOne = { password: '123' }; //mongodb
    global.compare = false; //bcrypt

    request(httpRoute)
      .get('/auth/login')
      .set('Accept', 'application/json')
      .set(
        'authorization',
        'Basic dGttaG91c2VAZ21haWwuY29tOkRyYWdvbmRGRkZseSE='
      )
      .expect(400, { errors: ['401'] })
      .end(done);
  });
  it('valid username  and valid password', (done) => {
    global.findOne = { password: 'DragondFFFly!', _id: '123' }; //mongodb
    global.compare = true; //bcrypt
    global.sign = 'test'; //jwt

    request(httpRoute)
      .get('/auth/login')
      .set('Accept', 'application/json')
      .set('authorization', 'Basic dGttaG91c2U6RHJhZ29uZEZGRmx5IQ==')
      .expect(200, { token: 'test' })
      .end(done);
  });

  it('valid email  and valid password', (done) => {
    global.findOne = { password: 'DragondFFFly!', _id: '123' }; //mongodb
    global.compare = true; //bcrypt
    global.sign = 'test'; //jwt

    request(httpRoute)
      .get('/auth/login')
      .set('Accept', 'application/json')
      .set('authorization', 'Basic dGttaG91c2U6RHJhZ29uZEZGRmx5IQ==')
      .expect(200, { token: 'test' })
      .end(done);
  });
});
