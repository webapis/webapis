describe('initWSocket', () => {
  beforeEach(() => {
    cy.login({
      username: 'demo',
      email: 'demo@gmail.com',
      password: 'Dragonfly1977!!!',
    });
  });
  it('init websocket', () => {
    cy.visit('/');
    //1. navigation to Hangouts
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.wait(50);
    cy.get('[data-testid=hangouts]').click();
  });
});
