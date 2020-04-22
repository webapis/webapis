require('babel-polyfill');
import request from 'supertest';
import httpRoute from '../../http-route';
import {
  containsHttpAuthHeader,
  getCredentials,
  getAuthType,
  getToken,
} from '../http-auth';
describe('http-auth', () => {
  describe('containsHttpAuthHeader', () => {
    it('containsHttpAuthHeader Basic', () => {
      const req = {
        headers: { authorization: 'Basic  emailorusername:password' },
      };
      expect(containsHttpAuthHeader(req)).toBe(true);
    });

    it('containsHttpAuthHeader Basic', () => {
      const req = {
        headers: { authorization: 'Bearer  emailorusername:password' },
      };
      expect(containsHttpAuthHeader(req)).toBe(true);
    });
    it('containsHttpAuthHeader Empty', () => {
      const req = { headers: { authorization: '  emailorusername:password' } };
      expect(containsHttpAuthHeader(req)).toBe(false);
    });
  });

  describe('getAuthType', () => {
    it('Bearer', () => {
      const req = {
        headers: { authorization: 'Bearer  emailorusername:password' },
      };
      expect(getAuthType(req)).toBe('Bearer');
    });
    it('Basic', () => {
      const req = {
        headers: { authorization: 'Basic  emailorusername:password' },
      };
      expect(getAuthType(req)).toBe('Basic');
    });
    it('Null', () => {
      const req = { headers: { authorization: '  emailorusername:password' } };
      expect(getAuthType(req)).toBe(null);
    });
  });

  describe('getCredentials', () => {
    it('return credentials', () => {
      debugger;
      const req = {
        headers: { authorization: 'Basic dGttaG91c2U6ZHJhZ29uZmx5' },
      };
      expect(getCredentials(req)).toMatchObject({
        emailorusername: 'tkmhouse',
        password: 'dragonfly',
      });
    });
  });
  describe('getToken', () => {
    it('returns token', () => {
      debugger;
      const req = {
        headers: { authorization: 'Bearer dGttaG91c2U6ZHJhZ29uZmx5' },
      };
      expect(getToken(req)).toBe('dGttaG91c2U6ZHJhZ29uZmx5');
    });
  });

  it('Authentication header exists', (done) => {
    debugger;
    request(httpRoute)
      .get('/auth/login')
      .set('Authorization', 'Basic  username:password')
      .expect((res) => {
        let result = res;
        debugger;
      })
      .end(done);
  });

});
