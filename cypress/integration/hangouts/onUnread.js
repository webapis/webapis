describe('UNREAD_HANGOUTS', () => {

  beforeEach(() => {
    const demo = {
      username: 'demo',
      email: 'demo@gmail.com',
      password: 'Dragonfly1977!!!',
    };
    const bero = {
      username: 'bero',
      email: 'bero@gmail.com',
      password: 'Dragonly_1999!',
    };
    cy.task('seed:deleteCollection', {
      dbName: 'auth',
      collectionName: 'users',
    });
    cy.task('seed:user', demo);
    cy.task('seed:user', bero);

    //cy.window().its('localStorage').invoke('removeItem', 'bero-hangouts');
  });
  it('onUnread hangouts', () => {
    //demo invites bero

    cy.loginByEmail({
      email: 'demo@gmail.com',
      password: 'Dragonfly1977!!!',
    });
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.wait(50);
    cy.get('[data-testid=hangouts]').click();
    cy.get('[data-testid=search-input]').type('bero');
    cy.get('[data-testid=search-btn]').click();
    cy.get('[data-testid=bero]').click();
    cy.get('[data-testid=invite-ui]');
    cy.get('[data-testid=messageTextInput]').type('Lets chat on Hangout');
    cy.get('[data-testid=oninvite-btn]').click();
    cy.get('[data-testid=invitee-ui]');
    //bero recieves one unread message from demo
    
    cy.loginByEmail({
      email: 'bero@gmail.com',
      password: 'Dragonly_1999!',
    });
    cy.visit('/');
   cy.wait(50)
  
   // cy.get('[data-testid=nav-unreads]').click()
   // cy.get('[data-testid=demo]').click()
   // cy.get('[data-testid=message-count]').contains('1')

  })
})