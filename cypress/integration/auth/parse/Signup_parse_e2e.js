import validationMessages from '../../../../client/form/validationMessages';
describe('Signup',()=>{
    beforeEach(()=>{
        cy.visit('/')

    
      

    })
    it('empty Password',()=>{
        cy.get('[data-testid=menu]').click()
        cy.get('[data-testid=signup]').click()
        cy.get('[data-testid=username]').type('testos')
        cy.get('[data-testid=email]').type('testos@mail.com')
     //   cy.get('[data-testid=password]').type('TestPass_1977!')
        cy.get('[data-testid=signup-btn]').click()
        cy.get('[data-testid=message-password]').contains(
            validationMessages.INVALID_PASSWORD
          );
    })
    it('empty username',()=>{
        cy.get('[data-testid=menu]').click()
        cy.get('[data-testid=signup]').click()
       // cy.get('[data-testid=username]').type('')
        cy.get('[data-testid=email]').type('testos@mail.com')
        cy.get('[data-testid=password]').type('TestPass_1977!')
        cy.get('[data-testid=signup-btn]').click()
        cy.get('[data-testid=message-username]').contains(
            validationMessages.INVALID_EMPTY_STRING
          );
    })
    it('empty email',()=>{
        cy.get('[data-testid=menu]').click()
        cy.get('[data-testid=signup]').click()
        cy.get('[data-testid=username]').type('testos')
        //cy.get('[data-testid=email]').type('')
        cy.get('[data-testid=password]').type('TestPass_1977!')
        cy.get('[data-testid=signup-btn]').click()
        cy.get('[data-testid=message-email]').contains(
            validationMessages.INVALID_EMAIL
          );
    })
    //errors
    it('username is taken',()=>{
  

      cy.request({method:'POST',
      url: 'https://localhost:1337/parse/users',
      headers: {
          'Conten-Type': 'application/json',
          'X-Parse-Application-Id':'zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA',
          'X-Parse-REST-API-Key':'zHULrh2lOpHoGum0KJRaUSiCl2yYTxHfUZ7Xg9Oa',
           'X-Parse-Revocable-Session':'1'
        },
        body:{username:'testos',password:'Dragonfly1977!!', email:'testos@mail.com'}
  }).then(response=>{
      const {sessionToken,objectId}=response.body

          cy.get('[data-testid=menu]').click()
      cy.get('[data-testid=signup]').click()
      cy.get('[data-testid=username]').type('testos')
      cy.get('[data-testid=email]').type('testos@mail.com')
      cy.get('[data-testid=password]').type('TestPass_1977!')
      cy.get('[data-testid=signup-btn]').click()
  
      cy.get('[data-testid=message-username]').contains(
        validationMessages.USERNAME_TAKEN
      );
debugger;
      cy.request({method:'DELETE',
      url: `https://localhost:1337/parse/users/${objectId}`,
      headers: {
          'Conten-Type': 'application/json',
          'X-Parse-Application-Id':'zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA',
          'X-Parse-REST-API-Key':'zHULrh2lOpHoGum0KJRaUSiCl2yYTxHfUZ7Xg9Oa',
           'X-Parse-Session-Token':sessionToken
        },
       
  })
      debugger;
  })
    })


    it('email is taken',()=>{
  

        cy.request({method:'POST',
        url: 'https://localhost:1337/parse/users',
        headers: {
            'Conten-Type': 'application/json',
            'X-Parse-Application-Id':'zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA',
            'X-Parse-REST-API-Key':'zHULrh2lOpHoGum0KJRaUSiCl2yYTxHfUZ7Xg9Oa',
             'X-Parse-Revocable-Session':'1'
          },
          body:{username:'testos',password:'Dragonfly1977!!', email:'testos@mail.com'}
    }).then(response=>{
        const {sessionToken,objectId}=response.body
  
            cy.get('[data-testid=menu]').click()
        cy.get('[data-testid=signup]').click()
        cy.get('[data-testid=username]').type('testo')
        cy.get('[data-testid=email]').type('testos@mail.com')
        cy.get('[data-testid=password]').type('TestPass_1977!')
        cy.get('[data-testid=signup-btn]').click()
    
        cy.get('[data-testid=message-email]').contains(
          validationMessages.REGISTERED_EMAIL
        );
  debugger;
        cy.request({method:'DELETE',
        url: `https://localhost:1337/parse/users/${objectId}`,
        headers: {
            'Conten-Type': 'application/json',
            'X-Parse-Application-Id':'zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA',
            'X-Parse-REST-API-Key':'zHULrh2lOpHoGum0KJRaUSiCl2yYTxHfUZ7Xg9Oa',
             'X-Parse-Session-Token':sessionToken
          },
         
    })
        debugger;
    })
      })

      it('Successfull signup',()=>{

        cy.get('[data-testid=menu]').click()
        cy.get('[data-testid=signup]').click()
        cy.get('[data-testid=username]').type('testo')
        cy.get('[data-testid=email]').type('testos@mail.com')
        cy.get('[data-testid=password]').type('TestPass_1977!')
        cy.get('[data-testid=signup-btn]').click()
        cy.get('[data-testid=home]')
        cy.window()
        .its('localStorage')
        .invoke(
          'getItem',
          'webcom',
          
        ).then(result=>{
            debugger;
            const {token,objectId}= JSON.parse(result)
            cy.request({method:'DELETE',
            url: `https://localhost:1337/parse/users/${objectId}`,
            headers: {
                'Conten-Type': 'application/json',
                'X-Parse-Application-Id':'zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA',
                'X-Parse-REST-API-Key':'zHULrh2lOpHoGum0KJRaUSiCl2yYTxHfUZ7Xg9Oa',
                 'X-Parse-Session-Token':token
              },
             
        })
        });
})

})