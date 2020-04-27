import validationMessages from '../../../client/form/validationMessages';

describe('ChangePassword', () => {
  // describe('STATE:User was not logged in', () => {
  //   beforeEach(() => {
  //     cy.server();
  //     cy.route({
  //       url: '/auth/login',
  //       response: {
  //         token:
  //           'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTU2ZGU2NTUyNmJhM2JkYzdjNDg4YSIsIm5hbWUiOiJ3ZWJhcGlzLmdpdGh1YkBnbWFpbC5jb20iLCJpYXQiOjE1ODY4NjQzNzksImV4cCI6MTYxODQyMTMwNX0.6ija-jjG0Uva5StvQnZucndLOiUigEoQnd88W_qbEBc',
  //       },
  //     }).as('loginSuccess');
  //     cy.visit('/');
  //     cy.get('[data-testid=menu]').click();
  //     cy.get('[data-testid=login]').click();
  //     cy.get('[data-testid=emailOrUsername]')
  //       .type('tkm.house@gmail.com')
  //       .get('[data-testid=password]')
  //       .type('DragondFFFly!2324.')
  //       .get('[data-testid=login-btn]')
  //       .click();
  //     cy.wait('@loginSuccess').then((xhr) => {
  //       expect(xhr.request.headers['authorization']).to.equal(
  //         'Basic dGttLmhvdXNlQGdtYWlsLmNvbTpEcmFnb25kRkZGbHkhMjMyNC4='
  //       );
  //     });
  //     cy.wait(50);
  //     cy.get('[data-testid=menu]').click();
  //     cy.get('[data-testid=changepassword]').click();
  //   });
  //   it('all fields are empty client', () => {
  //     cy.get('[data-testid=emailorusername]')
  //       .focus()
  //       .blur()
  //       .get('[data-testid=message-emailorusername]')
  //       .contains(validationMessages.INVALID_USERNAME_OR_EMAIL);
  //     cy.get('[data-testid=current]')
  //       .focus()
  //       .blur()
  //       .get('[data-testid=message-current]')
  //       .contains(validationMessages.INVALID_EMPTY_STRING);
  //     cy.get('[data-testid=password]')
  //       .focus()
  //       .blur()
  //       .get('[data-testid=message-password]')
  //       .contains(validationMessages.INVALID_PASSWORD);
  //     cy.get('[data-testid=confirm]')
  //       .focus()
  //       .blur()
  //       .get('[data-testid=message-confirm]')
  //       .contains(validationMessages.PASSWORDS_DO_NOT_MATCH);
  //   });

  //   it('invalid emailorusername client', () => {
  //     cy.get('[data-testid=emailorusername]')
  //       .type('1234')
  //       .blur()
  //       .get('[data-testid=message-emailorusername]')
  //       .contains(validationMessages.INVALID_USERNAME_OR_EMAIL);
  //   });

  //   it('invalid credentials server', () => {
  //     cy.route({
  //       method: 'put',
  //       url: '/auth/changepass',
  //       status: 400,
  //       response: { errors: ['401'] },
  //     }).as('changepass');
  //     cy.get('[data-testid=emailorusername]').type('test@gmail.com');
  //     cy.get('[data-testid=current]').type('Dragondlt!23');
  //     cy.get('[data-testid=password]').type('Dragondlt!23');
  //     cy.get('[data-testid=confirm]').type('Dragondlt!23');
  //     cy.get('[data-testid=change-pass-btn]').click();

  //     cy.wait('@changepass').should((xhr) => {
  //       expect(xhr.status).to.equal(400);
  //     });
  //   });
  //   it('invalid password client', () => {
  //     cy.get('[data-testid=emailorusername]').type('test@gmail.com');
  //     cy.get('[data-testid=current]').type('Dragondlt!23');
  //     cy.get('[data-testid=password]')
  //       .type('Dra')
  //       .blur()
  //       .get('[data-testid=message-password]')
  //       .contains(validationMessages.INVALID_PASSWORD);
  //   });
  //   it('passwords do not match client', () => {
  //     cy.get('[data-testid=emailorusername]').type('test@gmail.com');
  //     cy.get('[data-testid=current]').type('Dragondlt!23');
  //     cy.get('[data-testid=password]').type('Dragondlt!23');
  //     cy.get('[data-testid=confirm]')
  //       .type('Dragondlt!')
  //       .blur()
  //       .get('[data-testid=message-confirm]')
  //       .contains(validationMessages.PASSWORDS_DO_NOT_MATCH);
  //   });

  //   it('successful password change', () => {
  //     cy.route({
  //       method: 'put',
  //       url: '/auth/changepass',
  //       status: 200,
  //       response: {
  //         token:
  //           'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTU2ZGU2NTUyNmJhM2JkYzdjNDg4YSIsIm5hbWUiOiJ3ZWJhcGlzLmdpdGh1YkBnbWFpbC5jb20iLCJpYXQiOjE1ODY4NjQzNzksImV4cCI6MTYxODQyMTMwNX0.6ija-jjG0Uva5StvQnZucndLOiUigEoQnd88W_qbEBc',
  //       },
  //     }).as('chagepass');
  //     cy.get('[data-testid=emailorusername]').type('test@gmail.com');
  //     cy.get('[data-testid=current]').type('Dragondlt!23');
  //     cy.get('[data-testid=password]').type('Dragondlt!23');
  //     cy.get('[data-testid=confirm]').type('Dragondlt!23');
  //     cy.get('[data-testid=change-pass-btn]').click();

  //     cy.wait('@chagepass').should((xhr) => {
  //       expect(xhr.status).to.equal(200);
  //     });
  //   });
  // });

  describe('STATE:User was logged in', () => {
    beforeEach(() => {
      cy.server();
      cy.route({
        url: '/auth/login',
        response: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTU2ZGU2NTUyNmJhM2JkYzdjNDg4YSIsIm5hbWUiOiJ3ZWJhcGlzLmdpdGh1YkBnbWFpbC5jb20iLCJpYXQiOjE1ODY4NjQzNzksImV4cCI6MTYxODQyMTMwNX0.6ija-jjG0Uva5StvQnZucndLOiUigEoQnd88W_qbEBc',
        },
      }).as('loginSuccess');
      cy.visit('/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.get('[data-testid=login]').click();
      cy.get('[data-testid=emailOrUsername]')
        .type('tkm.house@gmail.com')
        .get('[data-testid=password]')
        .type('DragondFFFly!2324.')
        .get('[data-testid=login-btn]')
        .click();
      cy.get('[data-testid=menu]').click();
      cy.get('[data-testid=changepassword]').click();
    });
    it('invalid password client', () => {
      cy.get('[data-testid=password]')
        .type('Dra')
        .blur()
        .get('[data-testid=message-password]')
        .contains(validationMessages.INVALID_PASSWORD);
    });
    it('passwords do not match client', () => {
      cy.get('[data-testid=password]').type('Dragondlt!23');
      cy.get('[data-testid=confirm]')
        .type('Dragondlt!')
        .blur()
        .get('[data-testid=message-confirm]')
        .contains(validationMessages.PASSWORDS_DO_NOT_MATCH);
    });

    it('successful password change', () => {
      cy.route({
        method: 'put',
        url: '/auth/changepass',
        status: 200,
        response: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTU2ZGU2NTUyNmJhM2JkYzdjNDg4YSIsIm5hbWUiOiJ3ZWJhcGlzLmdpdGh1YkBnbWFpbC5jb20iLCJpYXQiOjE1ODY4NjQzNzksImV4cCI6MTYxODQyMTMwNX0.6ija-jjG0Uva5StvQnZucndLOiUigEoQnd88W_qbEBc',
        },
      }).as('chagepass');
      cy.get('[data-testid=password]').type('Dragondlt!23');
      cy.get('[data-testid=confirm]').type('Dragondlt!23');
      cy.get('[data-testid=change-pass-btn]').click();

      cy.wait('@chagepass').should((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    });
  });
});
