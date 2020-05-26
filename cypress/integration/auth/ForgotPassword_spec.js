
import validationMessages from '../../../client/form/validationMessages';
describe('Forgot password', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=login]').click();
    cy.get('[data-testid=forgotpassword]').click();
  });
  it('invalid email format (client side validation)', () => {
    cy.get('[data-testid=email]').type('tmerer').blur();

    cy.get('[data-testid=message-email]').contains(
      validationMessages.INVALID_EMAIL
    );
  });
  it('email not registered (server side validation)', () => {
    cy.route({
      url: '/auth/requestpasschange',
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
      url: '/auth/requestpasschange',
      method: 'post',
      response: {},
    });
    cy.get('[data-testid=email]').type('test@gmail.com');
    cy.get('[data-testid=requestpasschange-btn]').click();
  });
});
