describe('initWSocket', () => {
  beforeEach(() => {
    cy.login({
      username: 'demo',
      email: 'demo@gmail.com',
      password: 'Dragonfly1977!!!',
    });
  });
  it('websocket is online', () => {
    cy.visit('/');
    cy.wait(1000)
    cy.get('[data-testid=online]')
  });
});
//