describe('onOnline',()=>{
    beforeEach(()=>{
        cy.task('seed:deleteCollection', {
            dbName: 'auth',
            collectionName: 'users',
          });
          cy.task('seed:deleteCollection', {
            dbName: 'hangouts',
            collectionName: 'users',
          });
          const userMessanger = {
            username: 'demo',
            email: 'demo@gmail.com',
            password: 'Dragonfly1977!!!',
          };
          const userMessangee = {
            username: 'bero',
            email: 'bero@gmail.com',
            password: 'Dragonly_1999!',
          };
          cy.task('seed:user',{...userMessangee})
          cy.task('seed:user',{...userMessanger})
          const messagerHangout = {
            username: 'bero',
            email: 'bero@gmail.com',
            state: 'ACCEPTED',
            message: { text: 'Lets chat on hang', timestamp: 1591417896448 },
          };
          const messangeeHangout = {
            username: 'demo',
            email: 'demo@gmail.com',
            state: 'ACCEPTER',
          };
          cy.task('seed:onMessage', {
            userMessanger,
            userMessangee,
            messagerHangout,
            messangeeHangout,
            dbName:'hangouts',collectionName:'users'
          });
    })
    it('onOnline',()=>{
        cy.loginByEmail({
            email: 'bero@gmail.com',
            password: 'Dragonly_1999!',
          });
          cy.visit('/');
          cy.wait(50);
    })
})