import validationMessages from '../../../client/form/validationMessages';
describe('Signup e2e', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();

    cy.get('[data-testid=signup]').click();
  });



  it('username is taken, email is registered', () => {
    cy.task('seed:user', {
      email: 'testuser@gmail.com',
      username: 'testuser',
      password: 'testDassword2020_!',
    });
    cy.signup({
      username: 'testuser',
      email: 'testuser@gmail.com',
      password: 'testDassword2020_!',
      click: true,
    });
    cy.get('[data-testid=message-username]').contains(
      validationMessages.USERNAME_TAKEN
    );
    cy.get('[data-testid=message-email]').contains(
      validationMessages.REGISTERED_EMAIL
    );
  });

  it('invalid username, email,password (empty fields)', () => {

    cy.signup({
      username: '',
      email: '',
      password: '',
      click: true,
      client: false,
      type: false,
    });

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
  

    cy.signup({
      username: '123',
      email: 'testgmail.com',
      password: '123!',
      click: true,
      client: false,
      type: false,
    });

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

  it('success signup', () => {
    cy.server();
    cy.route('POST', '/auth/signup').as('signup');
    cy.task('seed:delete', {});
      cy.signup({
        username: 'testuser',
        email: 'testuser@gmail.com',
        password: 'testDassword2020_!',
        click: true,
      });

    cy.wait('@signup').should((xhr) => {
      expect(xhr.status).to.equal(200);
    });
  });
});
