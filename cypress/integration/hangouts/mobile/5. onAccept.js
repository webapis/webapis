describe('OnAccept',()=>{
    beforeEach(()=>{
        cy.task('seed:deleteCollection',{dbName:'auth',collectionName:'users'})
        cy.task('seed:deleteCollection',{dbName:'hangouts',collectionName:'users'})
        const userInvited ={username:'demo',email:'demo@gmail.com',password:'Dragonly_1999!'}
        const userInviting ={username:'bero',email:'bero@gmail.com',password:'Dragonly_1999!'}
        const invitation ={username:'bero',email:'bero@gmail.com',state:'INVITER',caterogy:'PEER',message:{text:'Lets chat friend', timestamp:'1591180520432'}}
        const hangout ={username:'demo',email:'demo@gmail.com',state:'INVITEE',message:{text:"lets hang out", timestamp:1234567865}}
        cy.task('seed:insertInvitation', {
            userInvited,
            invitation,
            userInviting,
            hangout, 
            dbName:'hangouts',
            collectionName:'users'
          });
        
    
    })

    it('OnAccept',()=>{
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
        cy.get('[data-testid=search-input]').type('bero');
        cy.get('[data-testid=search-btn]').click();
        cy.get('[data-testid=bero]').click()
        cy.get('[data-testid=inviter-ui]')

        //accept invitation
        cy.get('[data-testid=accept-btn]').click()

        // load accepted invitation from localStorage
        cy.visit('/')
        cy.wait(50);
        cy.get('[data-testid=menu]').click();
        cy.wait(50);
        cy.get('[data-testid=hangouts]').click();
        cy.get('[data-testid=search-input]').type('bero');
        cy.get('[data-testid=search-btn]').click();
        cy.get('[data-testid=bero]').click()
        cy.get('[data-testid=hangchat-ui]')
        // load accepted invitation from server
        cy.window()
        .its('localStorage')
        .invoke('removeItem', 'demo-hangouts')
        cy.visit('/')
        cy.wait(50);
        cy.get('[data-testid=menu]').click();
        cy.wait(50);
        cy.get('[data-testid=hangouts]').click();
        cy.get('[data-testid=search-input]').type('bero');
        cy.get('[data-testid=search-btn]').click();
        cy.get('[data-testid=bero]').click()
        cy.get('[data-testid=hangchat-ui]')

        //login as inviter
        cy.login({
          username: 'bero',
          email: 'bero@gmail.com',
          password: 'Dragonfly1977!!!',
        });
        cy.visit('/')
        cy.wait(50);
        cy.get('[data-testid=menu]').click();
        cy.get('[data-testid=hangouts]').click();
        cy.get('[data-testid=search-input]').type('demo');
        cy.get('[data-testid=search-btn]').click();
        cy.get('[data-testid=demo]').click()
        cy.get('[data-testid=hangchat-ui]')
    })
})