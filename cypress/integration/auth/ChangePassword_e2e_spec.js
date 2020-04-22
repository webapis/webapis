import validationMessages from '../../../src/form/validationMessages';


describe('Change password with token', () => {
  beforeEach(() => {
    cy.task('seed:login', {
      email: 'test@gmail.com',
      username: 'tkmhousenew',
      password: 'Dragonfly1922!!',
    });
  });

  it('confirm did not match to new password', () => {
    cy.visit('http://localhost:3000/auth/login');
    cy.get('[data-testid=emailOrUsername]').type('test@gmail.com');
    cy.get('[data-testid=password]').type('Dragonfly1922!!');
    cy.get('[data-testid=login-btn]').click();
    cy.wait(1000);
    cy.get('[data-testid=change-password]').click();
    cy.get('[data-testid=password]').type('Dragonfly1933!!');
    cy.get('[data-testid=confirm]').type('Dragonfly1933!');
    cy.get('[data-testid=change-pass-btn]').click();
    cy.get('[data-testid=message-confirm]').contains(
      validationMessages.PASSWORDS_DO_NOT_MATCH
    );
  });

  it.only('Success ChangePassword with token', () => {
    cy.visit('http://localhost:3000/auth/login');
    cy.get('[data-testid=emailOrUsername]').type('test@gmail.com');
    cy.get('[data-testid=password]').type('Dragonfly1922!!');
    cy.get('[data-testid=login-btn]').click();
    cy.wait(1000);
    cy.get('[data-testid=change-password]').click();
    cy.get('[data-testid=password]').type('Dragonfly1933!!');
    cy.get('[data-testid=confirm]').type('Dragonfly1933!!');
    cy.get('[data-testid=change-pass-btn]').click();
    
  });
});

describe('Change password with credentials', () => {
  describe('Invalid credentials', () => {
    beforeEach(() => {
      cy.task('seed:delete', {});
      cy.visit('http://localhost:3000/auth/signup');
      cy.get('[data-testid=username]').type('lionardo');
      cy.get('[data-testid=email]').type('lionardo@gmail.com');
      cy.get('[data-testid=password]')
        .type('Dragonfly1978.')
        .get('[data-testid=signup-btn]')
        .click();
      cy.wait(1000);
    });
    it('email not registered', () => {
      cy.visit('http://localhost:3000/auth/changepassword');
      cy.get('[data-testid=emailorusername]').type('tkmhouse@gmail.com');
      cy.get('[data-testid=current]').type('Dragonfly1922!!');
      cy.get('[data-testid=password]').type('Dragonfly1988_!');
      cy.get('[data-testid=confirm]').type('Dragonfly1988_!');
      cy.get('[data-testid=change-pass-btn]').click();
      cy.get('[data-testid=message-emailorusername]').contains(
        validationMessages.INVALID_CREDENTIALS
      );
      cy.get('[data-testid=message-current]').contains(
        validationMessages.INVALID_CREDENTIALS
      );
    });
    it('username not registered', () => {
      cy.visit('http://localhost:3000/auth/changepassword');
      cy.get('[data-testid=emailorusername]').type('tkmhouse');
      cy.get('[data-testid=current]').type('Dragonfly1978.');
      cy.get('[data-testid=password]').type('Dragonfly1988_!');
      cy.get('[data-testid=confirm]').type('Dragonfly1988_!');
      cy.get('[data-testid=change-pass-btn]').click();
      cy.get('[data-testid=message-emailorusername]').contains(
        validationMessages.INVALID_CREDENTIALS
      );
      cy.get('[data-testid=message-current]').contains(
        validationMessages.INVALID_CREDENTIALS
      );
    });

    it('wrong password', () => {
      cy.visit('http://localhost:3000/auth/changepassword');
      cy.get('[data-testid=emailorusername]').type('lionardo@gmail.com');
      cy.get('[data-testid=current]').type('Dragonfly1922!');
      cy.get('[data-testid=password]').type('Dragonfly1988_!');
      cy.get('[data-testid=confirm]').type('Dragonfly1988_!');
      cy.get('[data-testid=change-pass-btn]').click();

      cy.get('[data-testid=message-emailorusername]').contains(
        validationMessages.INVALID_CREDENTIALS
      );
      cy.get('[data-testid=message-current]').contains(
        validationMessages.INVALID_CREDENTIALS
      );
    });

    it('successful password change', () => {
      cy.visit('http://localhost:3000/auth/changepassword');
      cy.get('[data-testid=emailorusername]').type('lionardo@gmail.com');
      cy.get('[data-testid=current]').type('Dragonfly1978.');
      cy.get('[data-testid=password]').type('Dragonfly1988_!');
      cy.get('[data-testid=confirm]').type('Dragonfly1988_!');
      cy.get('[data-testid=change-pass-btn]').click();
    });
  });
});
