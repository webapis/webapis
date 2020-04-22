import authMessages from '../../../src/auth/authMessages';
import validationMessages from '../../../src/form/validationMessages';
describe('Forgot password', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/auth/requestpasschange');
  });
  it('invalid email', () => {
    cy.get('[data-testid=email]').type('tmerer').blur();
    cy.get('[data-testid=message-email]').contains(
      validationMessages.INVALID_EMAIL
    );
  });
  it('email not registered', () => {
    cy.server();
    cy.route({
      url: 'http://localhost:8000/auth/requestpasschange',
      method: 'post',
      status: 400,
      response: { errors: ['408'] },
    });
    cy.get('[data-testid=email]').type('test@gmail.com').blur();
    cy.get('[data-testid=message-email]').should(
      'not.contain',
      validationMessages.INVALID_EMAIL
    );
    cy.get('[data-testid=requestpasschange-btn]').click();

    cy.get('[data-testid=message-email]').contains(
      validationMessages.EMAIL_NOT_REGISTERED
    );
  });
  it('passwordchange request submitted successfully', () => {
    cy.server();
    cy.route({
      url: 'http://localhost:8000/auth/requestpasschange',
      method: 'post',

      response: {},
    });
    cy.get('[data-testid=email]').type('test@gmail.com');
    cy.get('[data-testid=requestpasschange-btn]').click();
    cy.get('[data-testid=welcome]').contains(
      authMessages.FORGOT_PASSWORD_SUCCESS_MESSAGE
    );
  });
});
