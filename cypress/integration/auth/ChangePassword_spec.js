import validationMessages from '../../../src/form/validationMessages';

describe('ChangePassword', () => {
  describe('change password with token', () => {
    beforeEach(() => {
      cy.server();
      cy.route({
        url: 'http://localhost:8000/auth/changepass',
        method: 'PUT',
        status: 400,
        response: { errors: ['412'] },
      }).as('changepassSuccess');
      cy.visit(
        'http://localhost:3000/auth/changepassword?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTU2ZGU2NTUyNmJhM2JkYzdjNDg4YSIsIm5hbWUiOiJ3ZWJhcGlzLmdpdGh1YkBnbWFpbC5jb20iLCJpYXQiOjE1ODY4NjQzNzksImV4cCI6MTYxODQyMTMwNX0.6ija-jjG0Uva5StvQnZucndLOiUigEoQnd88W_qbEBc'
      );
    });

    it('passwordDoNotMatch client', () => {
      cy.get('[data-testid=password]').type('Dragonfly200!').blur();
      cy.get('[data-testid=confirm]').type('Dragonfly200!_').blur();
      cy.get('[data-testid=message-confirm]').contains(
        validationMessages.PASSWORDS_DO_NOT_MATCH
      );
    });
    it('passwordInvalid client', () => {
      cy.get('[data-testid=password]')
        .type('Dragos')
        .blur()
        .get('[data-testid=message-password]')
        .contains(validationMessages.INVALID_PASSWORD);
    });

    it('passwordDoNotMatch 412 server', () => {
      cy.get('[data-testid=password]').type('Dragos1999!_').blur();
      cy.get('[data-testid=confirm]').type('Dragos1999!_').blur();
      cy.get('[data-testid=change-pass-btn]').click();
    });
    it('passwordInvalid 406 server', () => {
      cy.server();
      cy.route({
        url: 'http://localhost:8000/auth/changepass',
        method: 'PUT',
        status: 400,
        response: { errors: ['406'] },
      }).as('changepassSuccess');
      cy.visit(
        'http://localhost:3000/auth/changepassword?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTU2ZGU2NTUyNmJhM2JkYzdjNDg4YSIsIm5hbWUiOiJ3ZWJhcGlzLmdpdGh1YkBnbWFpbC5jb20iLCJpYXQiOjE1ODY4NjQzNzksImV4cCI6MTYxODQyMTMwNX0.6ija-jjG0Uva5StvQnZucndLOiUigEoQnd88W_qbEBc'
      );
      cy.get('[data-testid=password]').type('Dragos1999!_').blur();
      cy.get('[data-testid=confirm]').type('Dragos1999!_').blur();
      cy.get('[data-testid=change-pass-btn]').click();
    });
    it('tokenExpired 413 server', () => {
      cy.server();
      cy.route({
        url: 'http://localhost:8000/auth/changepass',
        method: 'PUT',
        status: 500,
        response: { error: { message: 'Token expired' } },
      }).as('changepassSuccess');
      cy.visit(
        'http://localhost:3000/auth/changepassword?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTU2ZGU2NTUyNmJhM2JkYzdjNDg4YSIsIm5hbWUiOiJ3ZWJhcGlzLmdpdGh1YkBnbWFpbC5jb20iLCJpYXQiOjE1ODY4NjQzNzksImV4cCI6MTYxODQyMTMwNX0.6ija-jjG0Uva5StvQnZucndLOiUigEoQnd88W_qbEBc'
      );
      cy.get('[data-testid=password]').type('Dragos1999!_').blur();
      cy.get('[data-testid=confirm]').type('Dragos1999!_').blur();
      cy.get('[data-testid=change-pass-btn]').click();
    });
  });

  describe('change password with email and password', () => {
    it('empty emailorusername,current, password,confirm client', () => {
      cy.visit('http://localhost:3000/auth/changepassword');
      cy.get('[data-testid=emailorusername]')
        .focus()
        .blur()
        .get('[data-testid=message-emailorusername]')
        .contains(validationMessages.INVALID_USERNAME_OR_EMAIL);
      cy.get('[data-testid=current]')
        .focus()
        .blur()
        .get('[data-testid=message-current]')
        .contains(validationMessages.INVALID_EMPTY_STRING);
      cy.get('[data-testid=password]')
        .focus()
        .blur()
        .get('[data-testid=message-password]')
        .contains(validationMessages.INVALID_PASSWORD);
      cy.get('[data-testid=confirm]')
        .focus()
        .blur()
        .get('[data-testid=message-confirm]')
        .contains(validationMessages.PASSWORDS_DO_NOT_MATCH);
    });

    it('invalid emailorusername client', () => {
      cy.visit('http://localhost:3000/auth/changepassword');
      cy.get('[data-testid=emailorusername]')
        .type('1234')
        .blur()
        .get('[data-testid=message-emailorusername]')
        .contains(validationMessages.INVALID_USERNAME_OR_EMAIL);
    });
  });
  describe('change password with emailorusername and password', () => {});
});
