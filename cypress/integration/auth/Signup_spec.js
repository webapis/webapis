import validationMessages from '../../../client/form/validationMessages';
import authMessages from '../../../client/auth/authMessages';
describe('Signup', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/')
    cy.get('[data-testid=signup]').click();
  });
  it('signup success', () => {
    cy.server();
    cy.route({
      method: 'post',
      url: '/auth/signup',
      response: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTU2ZGU2NTUyNmJhM2JkYzdjNDg4YSIsIm5hbWUiOiJ3ZWJhcGlzLmdpdGh1YkBnbWFpbC5jb20iLCJpYXQiOjE1ODY4NjQzNzksImV4cCI6MTYxODQyMTMwNX0.6ija-jjG0Uva5StvQnZucndLOiUigEoQnd88W_qbEBc' },
    }).as('success');

    cy.get('[data-testid=username]')
      .type('tkmhousenew')
      .get('[data-testid=email]')
      .type('tkmhousenew@gmail.com')
      .get('[data-testid=password]')
      .type('Dragonfly1999!')
      .blur()
      .get('[data-testid=signup-btn]')
      .click();

  });
  it('invalid username client', () => {
    cy.get('[data-testid=username]')
      .type('123')
      .blur()
      .get('[data-testid=message-username]')
      .contains(validationMessages.INVALID_USERNAME);
  });
  it('invalid email client', () => {
    cy.get('[data-testid=email]')
      .type('tkmghouse')
      .blur()
      .get('[data-testid=message-email]')
      .contains(validationMessages.INVALID_EMAIL);
  });
  it('invalid password client', () => {
    cy.get('[data-testid=password]')
      .type('1234')
      .blur()
      .get('[data-testid=message-password]')
      .contains(validationMessages.INVALID_PASSWORD);
  });

  it('usernameIsTaken 402 sever', () => {
 
    cy.route({
      method: 'POST',
      url: '/auth/signup',
      status: 400,
      response: { errors: ['402'] },
    }).as('usernameIsTaken');
    cy.get('[data-testid=username]')
      .type('takenname')
      .get('[data-testid=email]')
      .type('tkmhouse@gmail.com')
      .get('[data-testid=password]')
      .type('DragonflyRRR!1977!')
      .get('[data-testid=signup-btn]')
      .click();
    cy.get('[data-testid=message-username]').contains(
      validationMessages.USERNAME_TAKEN
    );
  });
  it('emailIsRegistered 403 server', () => {

    cy.route({
      url: '/auth/signup',
      method:'post',
      status: 400,
      response: { errors: ['403'] },
    }).as('emailIsRegistered');
    cy.get('[data-testid=username]')
      .type('takenname')
      .get('[data-testid=email]')
      .type('registered@gmail.com')
      .get('[data-testid=password]')
      .type('DragonflyRRR!1977!')
      .get('[data-testid=signup-btn]')
      .click();

    cy.get('[data-testid=message-email]').contains(
      validationMessages.REGISTERED_EMAIL
    );
  });
  it('usernameInvalid 405 server', () => {
    cy.server();
    cy.route({
      url: '/auth/signup',
      status: 400,
      method:'post',
      response: { errors: ['405'] },
    }).as('usernameInvalid');
    cy.get('[data-testid=username]')
      .type('1234')
      .get('[data-testid=email]')
      .type('registered@gmail.com')
      .get('[data-testid=password]')
      .type('DragonflyRRR!1977!')
      .get('[data-testid=signup-btn]')
      .click();
    cy.get('[data-testid=message-username]').contains(
      validationMessages.INVALID_USERNAME
    );
  });
  it('passwordInvalid 406 server', () => {
    cy.route({
      url: '/auth/signup',
      method:'post',
      status: 400,
      response: { errors: ['405'] },
    }).as('usernameInvalid');
    cy.get('[data-testid=username]')
      .type('tkmhouse')
      .get('[data-testid=email]')
      .type('registered@gmail.com')
      .get('[data-testid=password]')
      .type('1234')
      .get('[data-testid=signup-btn]')
      .click();
    cy.get('[data-testid=message-password]').contains(
      validationMessages.INVALID_PASSWORD
    );
  });
  it('emailInvalid 407 server', () => {
    cy.server();
    cy.route({
      url: '/auth/signup',
      method:'post',
      status: 400,
      response: { errors: ['407'] },
    }).as('emailInvalid');
    cy.get('[data-testid=username]')
      .type('tkmhouse')
      .get('[data-testid=email]')
      .type('invalidgmail.com')
      .get('[data-testid=password]')
      .type('Dragondly1999!_')
      .get('[data-testid=signup-btn]')
      .click();
    cy.get('[data-testid=message-email]').contains(
      validationMessages.INVALID_EMAIL
    );
  });
});
