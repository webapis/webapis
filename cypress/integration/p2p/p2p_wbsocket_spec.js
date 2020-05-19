describe('wsocket', () => {
  beforeEach(() => {
    cy.viewport(700, 700);
    cy.login({
      username: 'demo',
      email: 'demo@gmail.com',
      password: 'Dragonfly1977!!!',
    });

    cy.remoteLogin({
      username: 'remote',
      email: 'remote@gmail.com',
      password: 'Dragonfly1977!!!',
    });
    cy.visit('/');
  });
  it('invite', () => {
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=p2p]').click();
    cy.get('[data-testid=contact-search]').type('remote');
    cy.get('[data-testid=contacts-list]').children().contains('remote').click();
    cy.get('[data-testid=invite]')
  });
});
