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
          const user = {
            username: 'bero',
            email: 'bero@gmail.com',
            password: 'Dragonly_1999!',
          };
          cy.task('seed:user',{...user})
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