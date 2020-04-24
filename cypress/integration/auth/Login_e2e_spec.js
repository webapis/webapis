import validationMessages from '../../../client/form/validationMessages';
import authMessages from '../../../client/auth/authMessages';
describe('Login e2e', () => {
  beforeEach(() => {
    cy.task('seed:login', {
      email: 'test@gmail.com',
      username: 'tkmhousenew',
      password: 'Dragonfly1922!!',
    });
    cy.visit('http://localhost:3000')
    cy.get('[data-testid=login]').click();
  });

  it('Sucess Login', () => {
    cy.server()
    cy.route('GET', '/auth/login').as('login')
    cy.get('[data-testid=emailOrUsername]').type('test@gmail.com');
    cy.get('[data-testid=password]').type('Dragonfly1922!!');
    cy.get('[data-testid=login-btn]').click();
  
    cy.wait('@login').should(xhr=>{
      expect(xhr.status).to.equal(200)
    })
  });

  it('invalid credentials(wrong email) provided', () => {

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
