import validationMessages from '../../../src/form/validationMessages';
import authMessages from '../../../src/auth/authMessages';
describe('Signup e2e', () => {


  it('success', () => {
    cy.task('seed:delete', {});
    cy.visit('http://localhost:3000/auth/signup');
    cy.get('[data-testid=username]').type('lionardo');
    cy.get('[data-testid=email]').type('lionardo@gmail.com');
    cy.get('[data-testid=password]')
      .type('Dragonfly1978.')
      .get('[data-testid=signup-btn]')
      .click();
    cy.get('[data-testid=welcome]').contains(
      authMessages.SIGNUP_SUCCESS_MESSAGE
    );
  });

  it('username is taken, email is registered', () => {
    cy.task('seed:user', {
      email: 'lionardo@gmail.com',
      username: 'lionardo',
      password: 'Dragonfly1978.',
    });
    cy.visit('http://localhost:3000/auth/signup');
    cy.get('[data-testid=username]').type('lionardo');
    cy.get('[data-testid=email]').type('lionardo@gmail.com');
    cy.get('[data-testid=password]')
      .type('Dragonfly1978.')
      .get('[data-testid=signup-btn]')
      .click();

    cy.get('[data-testid=message-username]').contains(
      validationMessages.USERNAME_TAKEN
    );
    cy.get('[data-testid=message-email]').contains(
      validationMessages.REGISTERED_EMAIL
    );
  });

  it('invalid username, email,password (empty fields)', () => {
    cy.visit('http://localhost:3000/auth/signup');
    cy.get('[data-testid=signup-btn]').click();
    cy.get('[data-testid=message-username]').contains(
      validationMessages.INVALID_USERNAME
    );
    cy.get('[data-testid=message-email]').contains(
      validationMessages.INVALID_EMAIL
    );
    cy.get('[data-testid=message-password]').contains(
      validationMessages.INVALID_PASSWORD
    );
  });

  it('invalid username, email,password (invalid field values types)', () => {
    cy.visit('http://localhost:3000/auth/signup');

    cy.get('[data-testid=username]').type('123');
    cy.get('[data-testid=email]').type('lionardogmail.com');
    cy.get('[data-testid=password]').type('159357');
    cy.get('[data-testid=signup-btn]').click();
    cy.get('[data-testid=message-username]').contains(
      validationMessages.INVALID_USERNAME
    );
    cy.get('[data-testid=message-email]').contains(
      validationMessages.INVALID_EMAIL
    );
    cy.get('[data-testid=message-password]').contains(
      validationMessages.INVALID_PASSWORD
    );
  });
});
