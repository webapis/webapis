describe('OnAccept',()=>{
    beforeEach(()=>{
        cy.task('seed:deleteCollection',{dbName:'auth',collectionName:'users'})
        cy.task('seed:deleteCollection',{dbName:'hangouts',collectionName:'users'})
        const user ={username:'demo',email:'demo@gmail.com',password:'Dragonly_1999!'}
        const invitation ={username:'bero',email:'bero@gmail.com',state:'INVITER',caterogy:'PEER',message:{text:'Lets chat friend', timestamp:'1591180520432'}}
        cy.task('seed:insertInvitation', {
            user,
            invitation,
            dbName:'hangouts',
            collectionName:'users'
          });
          cy.login({
            username: 'demo',
            email: 'demo@gmail.com',
            password: 'Dragonfly1977!!!',
          });
          cy.visit('/');
    
    })

    it('OnAccept',()=>{
        cy.wait(50);
        cy.get('[data-testid=menu]').click();
        cy.wait(50);
        cy.get('[data-testid=hangouts]').click();
        cy.get('[data-testid=search-input]').type('bero');
        cy.get('[data-testid=search-btn]').click();
        cy.get('[data-testid=bero]').click()
        cy.get('[data-testid=inviter-ui]')

        //accept invitation
    })
})