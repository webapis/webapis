import validationMessages from '../../../client/form/validationMessages';

describe('Signup', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();

    cy.get('[data-testid=signup]').click();
  });

  it('invalid username, email, password (client side validation)', () => {
    cy.signup({
      username: '123',
      email: 'tkmghouse',
      password: '1234',
      click: false,
      client: true,
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
  it('empty username, email, password (client side validation)', () => {
    cy.signup({
      username: '',
      email: '',
      password: '',
      click: true,
      client: true,
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
  it('usernameIsTaken 402 sever', () => {
    cy.route({
      method: 'POST',
      url: '/auth/signup',
      status: 400,
      response: { errors: ['402'] },
    }).as('usernameIsTaken');
    cy.signup({
      username: 'testuser',
      email: 'test@gmail.com',
      password: 'DragonflyRRR!1977!',
      click: true,
      client: false,
      type: true,
    });

    cy.get('[data-testid=message-username]').contains(
      validationMessages.USERNAME_TAKEN
    );
  });
  it('emailIsRegistered 403 server', () => {
    cy.route({
      url: '/auth/signup',
      method: 'post',
      status: 400,
      response: { errors: ['403'] },
    }).as('emailIsRegistered');

      cy.signup({
        username: 'testuser',
        email: 'test@gmail.com',
        password: 'DragonflyRRR!1977!',
        click: true,
        client: false,
        type: true,
      });
    cy.get('[data-testid=message-email]').contains(
      validationMessages.REGISTERED_EMAIL
    );
  });
  it('usernameInvalid 405 server', () => {
    cy.server();
    cy.route({
      url: '/auth/signup',
      status: 400,
      method: 'post',
      response: { errors: ['405','406','407'] },
    }).as('usernameInvalid');

      cy.signup({
        username: '1234',
        email: 'testgmail.com',
        password: '11!',
        click: true,
        client: false,
        type: true,
      });

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

  it('signup success', () => {
    cy.server();
    cy.route({
      method: 'post',
      url: '/auth/signup',
      response: {
        username: 'testuser',
        email: 'testuser@gmail.com',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTU2ZGU2NTUyNmJhM2JkYzdjNDg4YSIsIm5hbWUiOiJ3ZWJhcGlzLmdpdGh1YkBnbWFpbC5jb20iLCJpYXQiOjE1ODY4NjQzNzksImV4cCI6MTYxODQyMTMwNX0.6ija-jjG0Uva5StvQnZucndLOiUigEoQnd88W_qbEBc',
      },
    }).as('success');

    cy.signup({
      username: 'testuser',
      email: 'testuser@gmail.com',
      password: 'testDassword2020_!',
      click: true,
    });
  });
});
