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

  });
});
