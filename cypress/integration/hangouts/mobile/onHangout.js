describe('onHangout', () => {
beforeEach(()=>{

})
    it('onInvite', () => {
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
        cy.task('seed:deleteCollection', { dbName: 'auth', collectionName: 'users' })
        cy.task('seed:deleteCollection', { dbName: 'hangouts', collectionName: 'users' })
        cy.task('seed:user', demo)
        cy.task('seed:user', bero)
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
        cy.get('[data-testid=invite-ui]');
        cy.get('[data-testid=messageTextInput]').type('Lets chat on Hangout')
        cy.get('[data-testid=oninvite-btn]').click()
        cy.get('[data-testid=invitee-ui]');
    })
    it.only('onAccept', () => {
        cy.visit('/');
        cy.loginByEmail({
            email: 'bero@gmail.com',
            password: 'Dragonly_1999!',
        });
        cy.visit('/');
        cy.wait(50);
         cy.get('[data-testid=menu]').click();
         cy.wait(50);
         cy.get('[data-testid=hangouts]').click();
         cy.get('[data-testid=search-input]').type('demo');
         cy.get('[data-testid=search-btn]').click();
        // cy.get('[data-testid=demo]').click();
    })
})