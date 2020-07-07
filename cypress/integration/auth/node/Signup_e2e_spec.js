import validationMessages from '../../../../client/features/authentication/validation/validationMessages';
describe('Signup e2e', () => {
  beforeEach(() => {
    cy.visit('/');
 
    cy.get('[data-testid=signup-link]').click();
    //parse
    if(Cypress.env('back')==="parse"){
      cy.task('seed:dropDatabase', {
        dbName: 'test',
      });
    }
   
  });


  //node
  it('username is taken, email is registered', () => {

    //node
    if(Cypress.env('back')==="node"){
      cy.task('seed:user', {
        email: 'testuser@gmail.com',
        username: 'testuser',
        password: 'testDassword2020_!',
      });
  
    cy.get('[data-testid=username]').type(`testuser`)
    cy.get('[data-testid=email]').type(`testuser@gmail.com`)
    cy.get('[data-testid=password]').type(`testDassword2020_!`)
    cy.get('[data-testid=signup-btn]').click();
   
    cy.get('[data-testid=message-username]').contains(
      validationMessages.USERNAME_TAKEN
    );
    cy.get('[data-testid=message-email]').contains(
      validationMessages.REGISTERED_EMAIL
    );
  }
  });
  // parse
  it('username is taken', () => {

    if(Cypress.env('back')==="parse") {
      cy.signupParse({username:'testuser',
      email:'testuser@gmail.com', 
      password:'testDassword2020_!'})
    }

    cy.get('[data-testid=username]').type(`testuser`)
    cy.get('[data-testid=email]').type(`testuser@gmail.com`)
    cy.get('[data-testid=password]').type(`testDassword2020_!`)
    cy.get('[data-testid=signup-btn]').click();
   
    cy.get('[data-testid=message-username]').contains(
      validationMessages.USERNAME_TAKEN
    );

  });
   // parse
   it('email is taken', () => {

    if(Cypress.env('back')==="parse") {
      cy.signupParse({username:'test',
      email:'testuser@gmail.com', 
      password:'testDassword2020_!'})
    cy.get('[data-testid=username]').type(`testuser`)
    cy.get('[data-testid=email]').type(`testuser@gmail.com`)
    cy.get('[data-testid=password]').type(`testDassword2020_!`)
    cy.get('[data-testid=signup-btn]').click();
   
    cy.get('[data-testid=message-email]').contains(
      validationMessages.REGISTERED_EMAIL
    );
  }
  });
  //node,parse
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
// parse,node
  it('invalid username, email,password (invalid field values types)', () => {
  
    cy.get('[data-testid=username]').type(`123`)
    cy.get('[data-testid=email]').type(`testgmail.com`)
    cy.get('[data-testid=password]').type(`123!`)
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
//parse,node
  it('success signup', () => {
    if(Cypress.env('back')==="node") {
      cy.server();
      cy.route('POST', '/auth/signup').as('signup');
      cy.task('seed:delete', {});
    }
    
  
      cy.get('[data-testid=username]').type(`testuser`)
      cy.get('[data-testid=email]').type(`testuser@gmail.com`)
      cy.get('[data-testid=password]').type(`testDassword2020_!`)
      cy.get('[data-testid=signup-btn]').click();


      cy.get('[data-testid=profile-link]')
      if(Cypress.env('back')==="node") {
        cy.wait('@signup').should((xhr) => {
          expect(xhr.status).to.equal(200);
        });

      }
   
  });
});
