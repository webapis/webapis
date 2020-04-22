require('babel-polyfill');

import httpRoute from '../../http-route';
const request = require('supertest');

describe('changePassword', () => {
  describe('with token', () => {
    it('token expired 413', (done) => {
      global.sign = 'testtoken';
      global.verify = { reject: { message: 'jwt expired' } };
      global.findOneAndUpdate = { value: { email: '' } };

      request(httpRoute)
        .put('/auth/changepass/')
        .send({
          token: 'mytoken',
          emailorusername: '',
          password: '',
          current: '',
          confirm: '',
        })
        .set('Accept', 'application/json')
        .expect(500, done);
    });
  });

  describe('with emailorusername and password', () => {
    it('usernameoremail, current,password,confirm is empty', (done) => {
      debugger;

      request(httpRoute)
        .put('/auth/changepass/')
        .send({
          token: '',
          emailorusername: '',
          password: '',
          current: '',
          confirm: '',
        })
        .set('Accept', 'application/json')
        .expect(400, { errors: ['410', '409', '406', '412'] })
        .end(done);
    });
  });
  it('invalid credentials (email does not exist)', (done) => {
    debugger;
    global.findOne = null;

    request(httpRoute)
      .put('/auth/changepass/')
      .send({
        token: '',
        emailorusername: 'test@gmail.com',
        password: '123123123',
        current: 'Dragosddsea',
        confirm: '123123123',
      })
      .set('Accept', 'application/json')
      .expect(400, { errors: ['401'] })
      .end(done);
  });
  it('invalid credentials (username does not exist)', (done) => {
    debugger;
    global.findOne = null;

    request(httpRoute)
      .put('/auth/changepass/')
      .send({
        token: '',
        emailorusername: 'tknhousenew',
        password: '123123123',
        current: 'Dragosddsea',
        confirm: '123123123',
      })
      .set('Accept', 'application/json')
      .expect(400, { errors: ['401'] })
      .end(done);
  });
  it('invalid credentials (wrong password)', (done) => {
    global.findOne = { password: '' };
    global.compare = false;
    global.findOneAndUpdate = { value: { email: '' } };
    request(httpRoute)
      .put('/auth/changepass/')
      .send({
        token: '',
        emailorusername: 'tknhousenew',
        password: '123123123',
        current: 'Dragosddsea',
        confirm: '123123123',
      })
      .set('Accept', 'application/json')
      .expect(400, { errors: ['401'] })
      .end(done);
  });

  it('confirm do not match', (done) => {
    debugger;
    global.findOne = { password: '' };
    global.compare = true;
    global.findOneAndUpdate = { value: { email: '' } };
    request(httpRoute)
      .put('/auth/changepass/')
      .send({
        token: '',
        emailorusername: 'tknhousenew',
        password: '123123123',
        current: 'Dragosddsea',
        confirm: '12312312',
      })
      .set('Accept', 'application/json')
      .expect(400, { errors: ['412'] })
      .end(done);
  });
  it('success password change', (done) => {
    debugger;
    global.findOne = { password: '' };
    global.compare = true;
    global.findOneAndUpdate = { value: { email: '' } };
    global.sign = '123';
    request(httpRoute)
      .put('/auth/changepass/')
      .send({
        token: '',
        emailorusername: 'tknhousenew',
        password: '123123123',
        current: 'Dragosddsea',
        confirm: '123123123',
      })
      .set('Accept', 'application/json')
      .expect(200, { token: '123' })
      .end(done);
  });
});
