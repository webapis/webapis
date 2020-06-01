describe('loadHangouts', () => {
  beforeEach(() => {
    cy.login({
      username: 'demo',
      email: 'demo@gmail.com',
      password: 'Dragonfly1977!!!',
    });
    cy.window()
      .its('localStorage')
      .invoke(
        'setItem',
        'demo-hangouts',
        JSON.stringify([
          {
            username: 'localuser1',
            email: 'localuser1@gmail.com',
            message: { text: 'Hello', timestamp: 1590984738993 },
            state: 'CHAT',
          },
          {
            username: 'localuser2',
            email: 'localuser2@gmail.com',
            message: { text: 'Hello', timestamp: 1590984738993 },
            state: 'CHAT',
          }
        ])
      );
   
  });
  it('loadHangout', () => {
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.wait(50);
    cy.get('[data-testid=hangouts]').click();
    cy.get('[data-testid=localuser1]')
    cy.get('[data-testid=localuser2]')
  });

 
});
