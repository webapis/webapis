import validationMessages from '../../../../client/features/authentication/validation/validationMessages';

describe('Login e2e', () => {
  beforeEach(() => {
    cy.task('seed:login', {
      email: 'testuser@gmail.com',
      username: 'testuser',
      password: 'Dragonfly1922!!',
    });
    cy.visit('/')

    cy.get('[data-testid=login-link]').click();
  });



  it('invalid credentials(wrong email) provided', () => {

    cy.get('[data-testid=emailorusername]').type('tests@gmail.com');
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
   
    cy.get('[data-testid=emailorusername]').type('test@gmail.com');
    cy.get('[data-testid=password]').type('Dragonfly1922!');
    cy.get('[data-testid=login-btn]').click();
    cy.get('[data-testid=message-emailorusername]').contains(
      validationMessages.INVALID_CREDENTIALS
    );
    cy.get('[data-testid=message-password]').contains(
      validationMessages.INVALID_CREDENTIALS
    );
  });
  it('Sucess Login', () => {
    cy.server()
    cy.route('GET', '/auth/login').as('login')
    cy.get('[data-testid=emailorusername]').type('testuser@gmail.com');
    cy.get('[data-testid=password]').type('Dragonfly1922!!');
    cy.get('[data-testid=login-btn]').click();
    cy.get('[data-testid=profile-link]')
    cy.get('[data-testid=signout-link]').click()
    cy.get('[data-testid=login-link]')
    cy.get('[data-testid=signup-link]')
    cy.wait('@login').should(xhr=>{
      expect(xhr.status).to.equal(200)
    })
  });
});
