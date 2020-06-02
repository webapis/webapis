describe('onInvite', () => {
  beforeEach(() => {
    cy.task('seed:user', {
      username: 'newuser',
      email: 'newuser@email.com',
      password: 'DragonLand!!!',
    });
    cy.server();
    cy.login({
      username: 'demo',
      email: 'demo@gmail.com',
      password: 'Dragonfly1977!!!',
    });
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.wait(50);
    cy.get('[data-testid=hangouts]').click();
  });
  it('onInvite', () => {

    //1.find newuser
    cy.get('[data-testid=search-input]').type('newuser');
    cy.get('[data-testid=search-btn]').click();
    cy.get('[data-testid=users-list]').children().should('have.length', 1);
    cy.get('[data-testid=newuser]')
    //2.select user
    cy.get('[data-testid=newuser]').click()

    //3. send Invitation
    cy.get('[data-testid=messageTextInput]').type('Lets hangchat')
 // cy.get('[data-testid=oninvite-btn]').click()
  });
});
