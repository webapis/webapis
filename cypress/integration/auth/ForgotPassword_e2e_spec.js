import validationMessages from '../../../client/form/validationMessages';
describe('ForgotPassword e2e', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=login]').click();
    cy.get('[data-testid=forgotpassword]').click();
  });
  it('invalid email (server side validation)', () => {
    cy.get('[data-testid=email]').type('tmerer');
    cy.get('[data-testid=requestpasschange-btn]').click();
    cy.get('[data-testid=message-email]').contains(
      validationMessages.INVALID_EMAIL
    );
  });
  it('empty email (server side validation)', () => {
    cy.get('[data-testid=email]');
    cy.get('[data-testid=requestpasschange-btn]').click();
    cy.get('[data-testid=message-email]').contains(
      validationMessages.INVALID_EMAIL
    );
  });
  it('email not registered', () => {
    cy.get('[data-testid=email]').type('testuse@gmail.com');
    cy.get('[data-testid=requestpasschange-btn]').click();
    cy.get('[data-testid=message-email]').contains(
      validationMessages.EMAIL_NOT_REGISTERED
    );
  });
  it.only('Successfull password change request submission', () => {
    const password = 'TestPassword2020_!!';
    const username = 'webapis';
    const email = 'webapis.github@gmail.com';

    cy.request({
      url: 'http://localhost:3000/seed/users',
      method: 'post',
      body: {
        username,
        email,
        password,
      },
    });
 
    cy.get('[data-testid=email]').type('webapis.github@gmail.com');
    cy.get('[data-testid=requestpasschange-btn]').click();

    cy.get('[data-testid=auth-feedback]');
  });
});
