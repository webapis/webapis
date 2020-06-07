describe('onMessage', () => {
  beforeEach(() => {
    const userInviter = {
      username: 'demo',
      email: 'demo@gmail.com',
      password: 'Dragonfly1977!!!',
    };
    const userAccepter = {
      username: 'bero',
      email: 'bero@gmail.com',
      password: 'Dragonly_1999!',
    };
    cy.task('seed:deleteCollection',{dbName:'auth',collectionName:'users'})
    cy.task('seed:user',userInviter)
    cy.task('seed:user',userAccepter)
  
    cy.task('seed:onAccept', {});

  });
  it(' state-ui test', () => {
      // demo messanger loads in correct state
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
      cy.get('[data-testid=hangchat-ui]')
      // bero messaner loads in correct state
      cy.loginByEmail({
        email: 'bero@gmail.com',
          password: 'Dragonly_1999!'
      });
      cy.visit('/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.wait(50);
      cy.get('[data-testid=hangouts]').click();
      cy.get('[data-testid=search-input]').type('demo');
      cy.get('[data-testid=search-btn]').click();
      cy.get('[data-testid=demo]').click();
      cy.get('[data-testid=hangchat-ui]')
  });

  it.only('test state change',()=>{
      //demo sends message
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
    //  cy.get('[data-testid=hangchat-ui]')
     // cy.get('[data-testid=message-input]').type('Lets chat on Hangchat')
      ///cy.get('[data-testid=send-btn]').click()

      
      // //bero recieves message
      // cy.loginByEmail({
      //   email: 'bero@gmail.com',
      //   password: 'Dragonly_1999!',
      // });
      // cy.visit('/');
      // cy.wait(50);
      // cy.get('[data-testid=menu]').click();
      // cy.wait(50);
      // cy.get('[data-testid=hangouts]').click();
      // cy.get('[data-testid=search-input]').type('demo');
      // cy.get('[data-testid=search-btn]').click();
      // cy.get('[data-testid=demo]').click();
      // cy.get('[data-testid=hangchat-ui]')
    })
});
