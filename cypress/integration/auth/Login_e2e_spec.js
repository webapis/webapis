import validationMessages from '../../../src/form/validationMessages';
import authMessages from '../../../src/auth/authMessages';
describe('Login e2e', () => {
  beforeEach(() => {
    cy.task('seed:login', {
      email: 'test@gmail.com',
      username: 'tkmhousenew',
      password: 'Dragonfly1922!!',
    });
  });

  it('Sucess Login', () => {
    cy.visit('http://localhost:3000/auth/login');
    cy.get('[data-testid=emailOrUsername]').type('test@gmail.com');
    cy.get('[data-testid=password]').type('Dragonfly1922!!');
    cy.get('[data-testid=login-btn]').click();
    cy.get('[data-testid=welcome]').contains(
      authMessages.LOGIN_SUCCESS_MESSAGE
    );
  });

  it('invalid credentials(wrong email) provided', () => {
    cy.visit('http://localhost:3000/auth/login');
    cy.get('[data-testid=emailOrUsername]').type('tests@gmail.com');
    cy.get('[data-testid=password]').type('Dragonfly1922!!');
    cy.get('[data-testid=login-btn]').click();
    cy.get('[data-testid=message-emailorusername]').contains(
      validationMessages.INVALID_CREDENTIALS
    );
    cy.get('[data-testid=message-password]').contains(
      validationMessages.INVALID_CREDENTIALS
    );
  });

  it('invalid credentials(wrong password) provided', () => {
    cy.visit('http://localhost:3000/auth/login');
    cy.get('[data-testid=emailOrUsername]').type('test@gmail.com');
    cy.get('[data-testid=password]').type('Dragonfly1922!');
    cy.get('[data-testid=login-btn]').click();
    cy.get('[data-testid=message-emailorusername]').contains(
      validationMessages.INVALID_CREDENTIALS
    );
    cy.get('[data-testid=message-password]').contains(
      validationMessages.INVALID_CREDENTIALS
    );
  });
});
