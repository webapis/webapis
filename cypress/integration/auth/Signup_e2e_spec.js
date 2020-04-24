import validationMessages from '../../../client/form/validationMessages';
import authMessages from '../../../client/auth/authMessages';
describe('Signup e2e', () => {
  beforeEach(()=>{
    cy.visit('http://localhost:3000')
    cy.get('[data-testid=signup]').click();

  })

  it('success signup', () => {
    cy.server()
    cy.route('POST', '/auth/signup').as('signup')
    cy.task('seed:delete', {});
    cy.get('[data-testid=username]').type('lionardo');
    cy.get('[data-testid=email]').type('lionardo@gmail.com');
    cy.get('[data-testid=password]')
      .type('Dragonfly1978.')
      .get('[data-testid=signup-btn]')
      .click();
  
    cy.wait('@signup').should(xhr=>{
    
      expect(xhr.status).to.equal(200)
    })  
  });

  it('username is taken, email is registered', () => {
    cy.task('seed:user', {
      email: 'lionardo@gmail.com',
      username: 'lionardo',
      password: 'Dragonfly1978.',
    });
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
