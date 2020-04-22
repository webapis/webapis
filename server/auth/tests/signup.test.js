require('babel-polyfill');

import httpRoute from '../../http-route';
const request = require('supertest');
describe('Signup', () => {
  it(' empty username, email and password', (done) => {
    debugger;
    request(httpRoute)
      .post('/auth/signup')
      .send({ email: '', username: '', password: '' })
      .set('Accept', 'application/json')
      .expect(400, { errors: ['405', '407', '406'] })
      .end(done); //
  });
  it('invalid username, email and password', (done) => {
    debugger;
    request(httpRoute)
      .post('/auth/signup')
      .send({ email: 'hose.com', username: '123q', password: '00001' })
      .set('Accept', 'application/json')
      .expect(400, { errors: ['405', '407', '406'] })
      .end(done); //
  });

  it(' usernameIsTaken: 402, emailIsRegistered: 403', (done) => {
    debugger;
    global.findOne = { password: 'DragondFFFly!', _id: '123' }; //mongodb
    request(httpRoute)
      .post('/auth/signup')
      .send({
        email: 'test@gmail.com',
        username: 'testname',
        password: 'Dragus1888_!',
      })
      .set('Accept', 'application/json')
      .expect(400, { errors: ['402', '403'] })
      .end(done); //
  });

  it(' successful signup', (done) => {
    const user = {
      email: 'test@gmail.com',
      username: 'testname',
      password: 'Dragus1888_!',
    };
    debugger;
    global.findOne = null; //mongodb
    global.sign = '1234';
    global.insertOne = {
      ops: [
        {
          email: user.email,
          password: user.password,
          username: user.username,
          _id: '2234',
        },
      ],
    };
    request(httpRoute)
      .post('/auth/signup')
      .send(user)
      .set('Accept', 'application/json')
      .expect(200, { token: '1234' })
      .end(done); //
  });
});
