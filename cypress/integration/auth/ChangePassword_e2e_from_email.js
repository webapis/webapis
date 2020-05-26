describe('ChangePassword_e2e_from_email link', () => {
  beforeEach(() => {
 
    // cy.visit('/changepassword.html');
  });
  it('success', () => {
 
    cy.register({
      username: 'webapis',
      email: 'webapis.github@gmail.com',
      password: 'Dragonfly1977_!',
    });
    // cy.forgotpassword({ email: 'webapis.github@gmail.com' })
    //   .its('body')
    //   .then((body) => {
    //     cy.visit(
    //       `http://localhost:3000/reset/changepassword.html?token=${body.token}`
    //     );
     
    //    // cy.get('[data-testid=confirm]').type('Dragonfly1977_!').blur()
          
    // //  cy.get('[data-testid=change-pass-btn]').click();
    //   });
      cy.visit(
        `http://localhost:3000/reset/changepassword.html?token=123`
      );
    cy.get('[data-testid=password]').type('Dragonfly1977_!')
    cy.wait(100)
    cy.get('[data-testid=password]').blur()
   // cy.get('[data-testid=confirm]').type('Dragonfly1977_!')
  });
});
//
