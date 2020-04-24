import validationMessages from '../../../client/form/validationMessages';
import authMessages from '../../../client/auth/authMessages';
describe('Login', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');
    cy.get('[data-testid=login]').click();
  });
  it('Login Success', () => {
    cy.server();
    cy.route({
      url: '/auth/login',
      response: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTU2ZGU2NTUyNmJhM2JkYzdjNDg4YSIsIm5hbWUiOiJ3ZWJhcGlzLmdpdGh1YkBnbWFpbC5jb20iLCJpYXQiOjE1ODY4NjQzNzksImV4cCI6MTYxODQyMTMwNX0.6ija-jjG0Uva5StvQnZucndLOiUigEoQnd88W_qbEBc',
      },
    }).as('loginSuccess');

    cy.get('[data-testid=login]').click();
    cy.get('[data-testid=emailOrUsername]')
      .type('tkm.house@gmail.com')
      .get('[data-testid=password]')
      .type('DragondFFFly!2324.')
      .get('[data-testid=login-btn]')
      .click();
    cy.wait('@loginSuccess').then((xhr) => {
      expect(xhr.request.headers['authorization']).to.equal(
        'Basic dGttLmhvdXNlQGdtYWlsLmNvbTpEcmFnb25kRkZGbHkhMjMyNC4='
      );
    });
  });

  it('invalid usernameoremail and password client', () => {
  
    cy.route({
      url: '/auth/login',
      status: 400,
      response: { errors: ['401'] },
    }).as('loginInvalidCreden401');
    cy.get('[data-testid=emailOrUsername]')
      .type('1232343')
      .blur()
      .get('[data-testid=message-emailorusername]')
      .contains(validationMessages.INVALID_USERNAME_OR_EMAIL);

    cy.get('[data-testid=password]')
      .focus()
      .blur()
      .get('[data-testid=message-password]')
      .contains(validationMessages.INVALID_EMPTY_STRING);
  });
  it('empty emailorusername client', () => {
    cy.route({
      url: '/auth/login',
      status: 400,
      response: { errors: ['410'] },
    }).as('emailorusernameNotValid');
    cy.get('[data-testid=emailOrUsername]')
      .focus()
      .blur()
      .get('[data-testid=message-emailorusername]')
      .contains(validationMessages.INVALID_USERNAME_OR_EMAIL);
  });
  it('invalid credentials 401 server', () => {

    cy.route({
      url: '/auth/login',
      status: 400,
      response: { errors: ['401'] },
    }).as('invalidcredentials');

    cy.get('[data-testid=emailOrUsername]')
      .type('tkm.house.old@gmail.com')
      .get('[data-testid=password]')
      .type('DragondFFFly!')
      .get('[data-testid=login-btn]')
      .click();
    cy.get('[data-testid=message-emailorusername]').contains(
      validationMessages.INVALID_CREDENTIALS
    );
    cy.get('[data-testid=message-password]').contains(
      validationMessages.INVALID_CREDENTIALS
    );
  });

  it('emailorusernameNotValid 410 server', () => {
 
    cy.route({
      url: '/auth/login',
      status: 400,
      response: { errors: ['410'] },
    }).as('emailorusernameNotValid');
    cy.get('[data-testid=emailOrUsername]')
      .type('2333')
      .get('[data-testid=password]')
      .type('DragondFFFly!')
      .get('[data-testid=login-btn]')
      .click();
    cy.get('[data-testid=message-emailorusername]').contains(
      validationMessages.INVALID_USERNAME_OR_EMAIL
    );
  });
  it('emptyStringNotValid(password) 409  server', () => {
  
    cy.route({
      url: '/auth/login',
      status: 400,
      response: { errors: ['409'] },
    });
    cy.get('[data-testid=emailOrUsername]')
      .type('tkm.house.old@gmail.com')
      .get('[data-testid=password]');
    cy.get('[data-testid=login-btn]').click();
    cy.get('[data-testid=message-password]').contains(
      validationMessages.INVALID_EMPTY_STRING
    );
  });
  it('emailIsNotRegistered 408 server', () => {
  
    cy.route({
      url: '/auth/login',
      status: 400,
      response: { errors: ['408'] },
    }).as('emailIsNotRegistered');
    cy.get('[data-testid=emailOrUsername]')
      .type('tkm.house.temp@gmail.com')
      .get('[data-testid=password]')
      .type('DragonProp!')
      .get('[data-testid=login-btn]')
      .click();
    cy.get('[data-testid=message-emailorusername]').contains(
      validationMessages.EMAIL_NOT_REGISTERED
    );
  });

  it('usernameIsNotRegistered 411 server', () => {
    cy.route({
      url: '/auth/login',
      status: 400,
      response: { errors: ['411'] },
    }).as('usernameIsNotRegistered');
    cy.get('[data-testid=emailOrUsername]')
      .type('tkmhousenew')
      .get('[data-testid=password]')
      .type('DragonNotRegis')
      .get('[data-testid=login-btn]')
      .click();
    cy.get('[data-testid=message-emailorusername]').contains(
      validationMessages.USERNAME_NOT_REGISTERED
    );
  });
});
