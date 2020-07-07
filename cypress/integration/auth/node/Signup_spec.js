import validationMessages from '../../../../client/features/authentication/validation/validationMessages';

describe('Signup', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');

    cy.get('[data-testid=signup-link]').click();
    cy.task('seed:dropDatabase', {
      dbName: 'test',
    });
  });
//node, parse
  it('invalid username, email, password (client side validation)', () => {
 
    cy.get('[data-testid=username]')
    .type(`123`)
    .blur()
    .get('[data-testid=email]')
    .type(`tkmghouse`)
    .blur()
    .get('[data-testid=password]')
    .type(`1234`)
    .blur();
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
  //node, parse
  it('empty username, email, password (client side validation)', () => {

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
    //node, parse
  it('usernameIsTaken 402 sever', () => {
    if(Cypress.env('back')==="node"){
      cy.route({
        method: 'POST',
        url: '/auth/signup',
        status: 400,
        response: { errors: ['402'] },
      }).as('usernameIsTaken');
    }
    if(Cypress.env('back')==="parse"){
      cy.signupParse({username:'testuser',email:'test@gmail.com', password:'DragonflyRRR!1977!'})
   
    }

    cy.get('[data-testid=username]').type(`testuser`)
    cy.get('[data-testid=email]').type(`test@gmail.com`)
    cy.get('[data-testid=password]').type(`DragonflyRRR!1977!`)
    cy.get('[data-testid=signup-btn]').click();
    cy.get('[data-testid=message-username]').contains(
      validationMessages.USERNAME_TAKEN
    );
  });
  //node, parse
  it('emailIsRegistered 403 server', () => {
    if(Cypress.env('back')==="node"){
 cy.route({
      delay:3000,
      url: '/auth/signup',
      method: 'post',
      status: 400,
      response: { errors: ['403'] },
    }).as('emailIsRegistered');
    }
    if(Cypress.env('back')==="parse"){
      cy.signupParse({username:'testusers',email:'test@gmail.com', password:'DragonflyRRR!1977!'})
   
    }

    cy.get('[data-testid=username]').type(`testuser`)
    cy.get('[data-testid=email]').type(`test@gmail.com`)
    cy.get('[data-testid=password]').type(`DragonflyRRR!1977!`)
    cy.get('[data-testid=signup-btn]').click();
  
    cy.get('[data-testid=message-email]').contains(
      validationMessages.REGISTERED_EMAIL
    );
  });
  //node, parse
  it('usernameInvalid 405 server', () => {
    if(Cypress.env('back')==="node"){
      cy.server();
      cy.route({
        url: '/auth/signup',
        status: 400,
        method: 'post',
        response: { errors: ['405', '406', '407'] },
      }).as('usernameInvalid');

    }
  
    cy.get('[data-testid=username]').type(`1234`)
    cy.get('[data-testid=email]').type(`testgmail.com`)
    cy.get('[data-testid=password]').type(`11!`)
    cy.get('[data-testid=signup-btn]').click();
  

    cy.get('[data-testid=message-username]').contains(
      validationMessages.INVALID_USERNAME
    );
    cy.get('[data-testid=message-password]').contains(
      validationMessages.INVALID_PASSWORD
    );
    cy.get('[data-testid=message-email]').contains(
      validationMessages.INVALID_EMAIL
    );
  });
  //node
  it('Server error 500', () => {
    if(Cypress.env('back')==="node"){
      cy.server();
      cy.route({
        url: '/auth/signup',
        status: 500,
        method: 'post',
        response: { error: {message:'Server is unavailable'} },
      }).as('serverError');
    }
    if(Cypress.env('back')==="node"){

      cy.get('[data-testid=username]').type(`testuser`)
      cy.get('[data-testid=email]').type(`test@gmail.com`)
      cy.get('[data-testid=password]').type(`DragonflyRRR!1977!`)
      cy.get('[data-testid=signup-btn]').click();
      cy.get('[data-testid=alert]').contains('Server is unavailable')
    }

 
  });
  //node, parse
  it('signup success', () => {
    if(Cypress.env('back')==="node"){
      cy.server();
      cy.route({
        delay:3000,
        method: 'post',
        url: '/auth/signup',
        response: {
          username: 'testuser',
          email: 'testuser@gmail.com',
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTU2ZGU2NTUyNmJhM2JkYzdjNDg4YSIsIm5hbWUiOiJ3ZWJhcGlzLmdpdGh1YkBnbWFpbC5jb20iLCJpYXQiOjE1ODY4NjQzNzksImV4cCI6MTYxODQyMTMwNX0.6ija-jjG0Uva5StvQnZucndLOiUigEoQnd88W_qbEBc',
        },
      }).as('success');

    }
 

    cy.get('[data-testid=username]').type(`testuser`)
    cy.get('[data-testid=email]').type(`test@gmail.com`)
    cy.get('[data-testid=password]').type(`DragonflyRRR!1977!`)
    cy.get('[data-testid=signup-btn]').click();
    cy.get('[data-testid=profile-link]')
  });
});
