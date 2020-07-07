import validationMessages from '../../../../client/features/authentication/validation/validationMessages';


describe('Login', () => {
  beforeEach(() => {

    //parse
    if (Cypress.env('back') === "parse") {
      cy.task('seed:dropDatabase', {
        dbName: 'test',
      });
    }
    cy.server();
    cy.visit('/');


    cy.get('[data-testid=login-link]').click();

  });
  //node, parse
  it('invalid usernameoremail and password client', () => {
    cy.get('[data-testid=emailorusername]')
      .type('1232343')
      .blur()
      .get('[data-testid=message-emailorusername]')
      .contains(validationMessages.INVALID_USERNAME_OR_EMAIL);

    cy.get('[data-testid=password]')
      .focus()
      .blur()
      .get('[data-testid=message-password]')
      .contains(validationMessages.INVALID_EMPTY_STRING);
  });
  // node, parse
  it('empty emailorusername client', () => {

    cy.get('[data-testid=emailorusername]')
      .focus()
      .blur()
      .get('[data-testid=message-emailorusername]')
      .contains(validationMessages.INVALID_USERNAME_OR_EMAIL);
  });
  //node, parse
  it('invalid credentials 401 server', () => {
    if (Cypress.env('back') === "node") {
      cy.route({
        url: '/auth/login',
        status: 400,
        response: { errors: ['401'] },
      }).as('invalidcredentials');
    }
    if (Cypress.env('back') === "parse") {
      cy.signupParse({
        username: 'testuser',
        email: 'testuser@gmail.com',
        password: 'testDassword2020_!'
      })

    }

    cy.get('[data-testid=emailorusername]')
      .type('testuser@gmail.com')
      .get('[data-testid=password]')
      .type('DragondFFFly!')
      .get('[data-testid=login-btn]')
      .click();

    cy.get('[data-testid=message-emailorusername]').contains(
      validationMessages.INVALID_CREDENTIALS
    );
    cy.get('[data-testid=message-password]').contains(
      validationMessages.INVALID_CREDENTIALS
    );
  });

  //node, parse
  it('emailorusernameNotValid 410 server', () => {
    if (Cypress.env('back') === "node") {
      cy.route({
        url: '/auth/login',
        status: 400,
        response: { errors: ['410'] },
      }).as('emailorusernameNotValid');
    }

    cy.get('[data-testid=emailorusername]')
      .type('2333')
      .get('[data-testid=password]')
      .type('DragondFFFly!')
      .get('[data-testid=login-btn]')
      .click();
    cy.get('[data-testid=message-emailorusername]').contains(
      validationMessages.INVALID_CREDENTIALS
    );
    cy.get('[data-testid=message-password]').contains(
      validationMessages.INVALID_CREDENTIALS
    );
  });
  //node, parse
  it('emptyStringNotValid(password) 409  server', () => {
    if (Cypress.env('back') === "node") {
      cy.route({
        url: '/auth/login',
        status: 400,
        response: { errors: ['409'] },
      });
    }

    cy.get('[data-testid=emailorusername]')
      .type('tkm.house.old@gmail.com')
      .get('[data-testid=password]');
    cy.get('[data-testid=login-btn]').click();
    cy.get('[data-testid=message-password]').contains(
      validationMessages.INVALID_EMPTY_STRING
    );
  });
  //node, parse
  it('emailIsNotRegistered 408 server', () => {
    if (Cypress.env('back') === "node") {

      cy.route({
        url: '/auth/login',
        status: 400,
        response: { errors: ['408'] },
      }).as('emailIsNotRegistered');
    }

    cy.get('[data-testid=emailorusername]')
      .type('tkm.house.temp@gmail.com')
      .get('[data-testid=password]')
      .type('DragonProp!')
      .get('[data-testid=login-btn]')
      .click();
    cy.get('[data-testid=message-emailorusername]').contains(
      validationMessages.INVALID_CREDENTIALS
    );
    cy.get('[data-testid=message-password]').contains(
      validationMessages.INVALID_CREDENTIALS
    );
  });
  //node,parse
  it('usernameIsNotRegistered 411 server', () => {
    if (Cypress.env('back') === "node") {
      cy.route({
        url: '/auth/login',
        status: 400,
        response: { errors: ['411'] },
      }).as('usernameIsNotRegistered');
    }

    cy.get('[data-testid=emailorusername]')
      .type('tkmhousenew')
      .get('[data-testid=password]')
      .type('DragonNotRegis')
      .get('[data-testid=login-btn]')
      .click();
    cy.get('[data-testid=message-emailorusername]').contains(
      validationMessages.INVALID_CREDENTIALS
    );
    cy.get('[data-testid=message-password]').contains(
      validationMessages.INVALID_CREDENTIALS
    );
  });
  //node
  it('Server error 500', () => {
    if (Cypress.env('back') === "node") {
      cy.route({
        url: '/auth/login',
        status: 500,
        response: { error: { message: 'Server is down' } },
      }).as('usernameIsNotRegistered');
      cy.get('[data-testid=emailorusername]')
        .type('tkmhousenew')
        .get('[data-testid=password]')
        .type('DragonNotRegis')
        .get('[data-testid=login-btn]')
        .click();
      cy.get('[data-testid=alert]').contains(
        'Server is down'
      );
    }

  });
  //node, parse
  it('Login Success', () => {
    if (Cypress.env('back') === "node") {
      cy.server();
      cy.route({
        url: '/auth/login',
        response: {
          username: 'testuser',
          email: 'testuser@gmail.com',
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTU2ZGU2NTUyNmJhM2JkYzdjNDg4YSIsIm5hbWUiOiJ3ZWJhcGlzLmdpdGh1YkBnbWFpbC5jb20iLCJpYXQiOjE1ODY4NjQzNzksImV4cCI6MTYxODQyMTMwNX0.6ija-jjG0Uva5StvQnZucndLOiUigEoQnd88W_qbEBc',
        },
      }).as('loginSuccess');
    }
    if (Cypress.env('back') === "parse") {
      cy.signupParse({ username: 'testuser', email: 'testuser@gmail.com', password: 'DragonflyRRR!1977!' })

    }

    cy.get('[data-testid=emailorusername]')
      .type('testuser@gmail.com')
      .get('[data-testid=password]')
      .type('DragonflyRRR!1977!')
      .get('[data-testid=login-btn]')
      .click();
    cy.get('[data-testid=profile-link]')

  });
});
