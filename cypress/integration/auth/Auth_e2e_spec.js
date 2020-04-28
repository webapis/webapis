describe('Authentication fitures', () => {
  it('Login', () => {
    cy.login({
      emailorusername: 'test@gmail.com',
      password: 'testDragon1988_!',
    });
  });
});
