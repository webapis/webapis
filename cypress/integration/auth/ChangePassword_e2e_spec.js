import validationMessages from '../../../client/form/validationMessages';

describe('CHANGE PASSWORD', () => {
  beforeEach(() => {
    cy.task('seed:login', {
      email: 'test@gmail.com',
      username: 'tkmhousenew',
      password: 'Dragonfly1922!!',
    });
  });

  describe('Change password with token', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.get('[data-testid=login]').click();
      cy.get('[data-testid=emailOrUsername]')
        .type('test@gmail.com')
        .get('[data-testid=password]')
        .type('Dragonfly1922!!')
        .get('[data-testid=login-btn]')
        .click();
      cy.get('[data-testid=menu]').click();
      cy.get('[data-testid=changepassword]').click();
    });
    it('user sent empty password and confirm 406', () => {
      cy.get('[data-testid=change-pass-btn]').click();
      cy.get('[data-testid=message-password]').contains(
        validationMessages.INVALID_PASSWORD
      );
      cy.get('[data-testid=message-confirm]').contains(
        validationMessages.PASSWORDS_DO_NOT_MATCH
      );
    });

    it('user sent invalid password server 406', () => {
      cy.get('[data-testid=password]').type('123');
      cy.get('[data-testid=confirm]').type('123');
      cy.get('[data-testid=change-pass-btn]').click();
      cy.get('[data-testid=message-password]').contains(
        validationMessages.INVALID_PASSWORD
      );
    });

    it('password did not match 412', () => {
      cy.get('[data-testid=password]').type('Dragondlt197__d');
      cy.get('[data-testid=confirm]').type('123');
      cy.get('[data-testid=change-pass-btn]').click();
      cy.get('[data-testid=message-confirm]').contains(
        validationMessages.PASSWORDS_DO_NOT_MATCH
      );
    });

    it('Password changes successfully', () => {
      cy.server();
      cy.route('PUT', '/auth/changepass').as('changepass');
      cy.get('[data-testid=password]').type('Dragondlt197_!dsds');
      cy.get('[data-testid=confirm]').type('Dragondlt197_!dsds');
      cy.get('[data-testid=change-pass-btn]').click();

      cy.wait('@changepass').should((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    });
  });
  // describe('Change password with emailorusername and password', () => {
  //   beforeEach(() => {
  //     cy.visit('http://localhost:3000');
  //     cy.get('[data-testid=changepassword]').click();
  //   });
  //   it('user sent all fields empty ', () => {
  //     cy.get('[data-testid=change-pass-btn]').click();
  //     cy.get('[data-testid=message-emailorusername]').contains(
  //       validationMessages.INVALID_USERNAME_OR_EMAIL
  //     );
  //     cy.get('[data-testid=message-current]').contains(
  //       validationMessages.INVALID_EMPTY_STRING
  //     );
  //     cy.get('[data-testid=message-password]').contains(
  //       validationMessages.INVALID_PASSWORD
  //     );
  //     cy.get('[data-testid=message-confirm]').contains(
  //       validationMessages.PASSWORDS_DO_NOT_MATCH
  //     );
  //   });
  //   it('user sent invalid emailorusername', () => {
  //     cy.get('[data-testid=emailorusername]').type('123');
  //     cy.get('[data-testid=current]').type('Dragonfly1922!!');
  //     cy.get('[data-testid=password]').type('Dragonfly1922!!');
  //     cy.get('[data-testid=confirm]').type('Dragonfly1922!!');
  //     cy.get('[data-testid=change-pass-btn]').click();

  //     cy.get('[data-testid=message-emailorusername]').contains(
  //       validationMessages.INVALID_USERNAME_OR_EMAIL
  //     );
  //   });
  //   it('user sent invalid password (username)', () => {
  //     cy.get('[data-testid=emailorusername]').type('tkmhousenew');
  //     cy.get('[data-testid=current]').type('Dragonfly1922!');
  //     cy.get('[data-testid=password]').type('Dragonfly1922!!');
  //     cy.get('[data-testid=confirm]').type('Dragonfly1922!!');
  //     cy.get('[data-testid=change-pass-btn]').click();

  //     cy.get('[data-testid=message-current]').contains(
  //       validationMessages.INVALID_CREDENTIALS
  //     );
  //     cy.get('[data-testid=message-emailorusername]').contains(
  //       validationMessages.INVALID_CREDENTIALS
  //     );
  //   });
  //   it('user sent invalid password (email)', () => {
  //     cy.get('[data-testid=emailorusername]').type('test@gmail.com');
  //     cy.get('[data-testid=current]').type('Dragonfly1922!');
  //     cy.get('[data-testid=password]').type('Dragonfly1922!!');
  //     cy.get('[data-testid=confirm]').type('Dragonfly1922!!');
  //     cy.get('[data-testid=change-pass-btn]').click();

  //     cy.get('[data-testid=message-current]').contains(
  //       validationMessages.INVALID_CREDENTIALS
  //     );
  //     cy.get('[data-testid=message-emailorusername]').contains(
  //       validationMessages.INVALID_CREDENTIALS
  //     );
  //   });
  //   it('confirm mismatch', () => {
  //     cy.get('[data-testid=emailorusername]').type('test@gmail.com');
  //     cy.get('[data-testid=current]').type('Dragonfly1922!!');
  //     cy.get('[data-testid=password]').type('Dragonfly1922!!');
  //     cy.get('[data-testid=confirm]').type('Dragonfly1922!');
  //     cy.get('[data-testid=change-pass-btn]').click();
  //     cy.get('[data-testid=message-confirm]').contains(
  //       validationMessages.PASSWORDS_DO_NOT_MATCH
  //     );
  //   });

  //   it('passwordChanged successfully', () => {
  //     cy.server();
  //     cy.route('PUT', '/auth/changepass').as('changepass');
  //     cy.get('[data-testid=emailorusername]').type('test@gmail.com');
  //     cy.get('[data-testid=current]').type('Dragonfly1922!!');
  //     cy.get('[data-testid=password]').type('Dragonfly1923!!');
  //     cy.get('[data-testid=confirm]').type('Dragonfly1923!!');
  //     cy.get('[data-testid=change-pass-btn]').click();
  //     cy.wait('@changepass').should((xhr) => {
  //       expect(xhr.status).to.equal(200);
  //     });
  //   });

  //   it('emailorusername does not exist',()=>{
  //     cy.get('[data-testid=emailorusername]').type('tests@gmail.com');
  //     cy.get('[data-testid=current]').type('Dragonfly1922!!');
  //     cy.get('[data-testid=password]').type('Dragonfly1922!!');
  //     cy.get('[data-testid=confirm]').type('Dragonfly1922!!');
  //     cy.get('[data-testid=change-pass-btn]').click();
  //     cy.get('[data-testid=message-emailorusername]').contains(
  //       validationMessages.INVALID_CREDENTIALS
  //     );
  //     cy.get('[data-testid=message-current]').contains(
  //       validationMessages.INVALID_CREDENTIALS
  //     );
  //   })

  // });
});
