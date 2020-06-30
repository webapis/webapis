import validationMessages from '../../../../client/form/validationMessages';

describe('CHANGE PASSWORD', () => {
  // beforeEach(() => {
  //   cy.task('seed:login', {
  //     email: 'test@gmail.com',
  //     username: 'tkmhousenew',
  //     password: 'Dragonfly1922!!',
  //   });
  // });

  describe('Change password with token', () => {
    beforeEach(() => {
   
      cy.login({
        username: 'demo',
        email: 'demo@gmail.com',
        password: 'Dragonfly1977_!',
      });
      cy.visit('/');
      cy.get('[data-testid=menu]').click();
      cy.wait(50)
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
});
