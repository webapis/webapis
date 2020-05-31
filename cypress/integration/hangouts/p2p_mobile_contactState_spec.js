describe('wsocket', () => {
  beforeEach(() => {
    //cy.task('seed:hangouts', {});
  //cy.viewport(500, 500);
    cy.login({
      username: 'demo',
      email: 'demo@gmail.com',
      password: 'Dragonfly1977!!!',
    });

    // cy.remoteLogin({
    //   username: 'remote',
    //   email: 'remote@gmail.com',
    //   password: 'Dragonfly1977!!!',
    // });

    cy.visit('/');
  });
  it('invite', () => {
    cy.wait(500)
    cy.get('[data-testid=menu]').click();
    cy.wait(500)
    cy.get('[data-testid=hangouts]').click();
  });
});
