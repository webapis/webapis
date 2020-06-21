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
    const riodin = {
      username: 'riodin',
      email: 'riodin@gmail.com',
      password: 'Dragonly_1999!',
    };
    cy.task('seed:deleteCollection', {
      dbName: 'auth',
      collectionName: 'users',
    });
    cy.task('seed:user', demo);
    cy.task('seed:user', bero);
    cy.task('seed:user', riodin);
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
   cy.get('[data-testid=nav-unreads]').contains(1)
  
     cy.get('[data-testid=nav-unreads]').click()
    cy.get('[data-testid=demo-select]').click()
    
    cy.get('[data-testid=accept-btn]').click()
    cy.get('[data-testid=message-input]').type('Hello demo')
    cy.get('[data-testid=send-btn]').click()
    cy.get('[data-testid=message-count]').contains(0)
    cy.wait(50)
    cy.get('[data-testid=nav-unreads]').click()
    cy.get('[data-testid=demo-remove]').click()

    cy.loginByEmail({
      email: 'demo@gmail.com',
      password: 'Dragonfly1977!!!',
    });
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    //cy.wait(50)
    cy.get('[data-testid=message-count]').contains(2)
    cy.get('[data-testid=hangouts]').click();
    cy.get('[data-testid=bero]').click();
    cy.get('[data-testid=message]').contains('Hello demo');
    cy.get('[data-testid=message-count]').contains(0)
    cy.get('[data-testid=message-input]').type('Hello bero how are you')
    cy.get('[data-testid=send-btn]').click()

    cy.loginByEmail({
      email: 'bero@gmail.com',
      password: 'Dragonly_1999!',
    });
    cy.visit('/');
   cy.wait(50)
   cy.get('[data-testid=nav-unreads]').contains(1)


   cy.loginByEmail({
    email: 'riodin@gmail.com',
    password: 'Dragonly_1999!',
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


  cy.loginByEmail({
    email: 'bero@gmail.com',
    password: 'Dragonly_1999!',
  });
//cy.pause()
  cy.visit('/');
 cy.wait(50)
 cy.get('[data-testid=nav-unreads]').contains(2).click()
 //cy.wait(50)
 //cy.get('[data-testid=nav-unreads]').click()
 cy.wait(50)
 cy.get('[data-testid=demo-select]').click();
 cy.wait(50)
 cy.get('[data-testid=nav-unreads]').contains(1).click()
 cy.wait(50)
// cy.get('[data-testid=nav-unreads]').click()
 cy.wait(50)
 cy.get('[data-testid=riodin-select]').click();
 cy.get('[data-testid=accept-btn]').click()
// cy.get('[data-testid=message-input]').type('Hello riodin')
// cy.get('[data-testid=send-btn]').click()
// cy.wait(50)
 //cy.get('[data-testid=nav-unreads]').contains(0).click()
 //cy.wait(50)
 //cy.get('[data-testid=riodin-select]').click();

 cy.loginByEmail({
  email: 'riodin@gmail.com',
  password: 'Dragonly_1999!',
});
cy.visit('/');
cy.wait(50);
cy.get('[data-testid=menu]').click();
cy.wait(50);
cy.get('[data-testid=hangouts]').click();
cy.get('[data-testid=bero]').click();
  })
})