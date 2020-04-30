describe('ChangePassword_e2e_from_email link', () => {
  beforeEach(() => {

    cy.login({
      username: 'webapis',
      email: 'webapis.github@gmail.com',
      password: 'Dragonfly1977_!',
    });
       cy.visit('/reset/passresetlink');
  });
  it('success', () => {


  //  cy.get('[data-testid=password]').type('Dragonfly1977_!');
  //  cy.get('[data-testid=confirm]').type('Dragonfly1977_!');
    // cy.get('[data-testid=change-pass-btn]').click();
  });
});
//