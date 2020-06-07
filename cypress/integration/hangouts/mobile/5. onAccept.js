describe('OnAccept',()=>{
    beforeEach(()=>{
      const user = {
        username: 'bero',
        email: 'bero@gmail.com',
        password: 'Dragonly_1999!',
      };
      cy.task('seed:user',user)
      cy.task('seed:onInvite', {});
    })

    it('OnAccept',()=>{
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
        cy.get('[data-testid=demo]').click()
        cy.get('[data-testid=inviter-ui]')
        cy.get('[data-testid=accept-btn]').click()
        cy.get('[data-testid=hangchat-ui]')
    })
})