import validationMessages from '../../../../client/form/validationMessages';
describe('Login',()=>{
    it('Invalid Credentials (invalid emailorusername)',()=>{
        cy.request({method:'POST', url: 'https://localhost:1337/parse/users',
        headers: {
            'Conten-Type': 'application/json',
            'X-Parse-Application-Id':'zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA',
            'X-Parse-REST-API-Key':'zHULrh2lOpHoGum0KJRaUSiCl2yYTxHfUZ7Xg9Oa',
             'X-Parse-Revocable-Session':'1'
          },
          body:{username:'testos',password:'Dragonfly1977!!', email:'testos@mail.com'}})
          .then(response=>{
              debugger;
            cy.visit('/')
            cy.get('[data-testid=menu]').click()
            cy.get('[data-testid=login]').click()
            cy.get('[data-testid=emailOrUsername]').type('testo')
            cy.get('[data-testid=password]').type('Dragonfly1977!!')
            cy.get('[data-testid=login-btn]').click()
            cy.get('[data-testid=message-password]').contains(
                validationMessages.INVALID_CREDENTIALS
              );
              cy.get('[data-testid=message-emailorusername]').contains(
                validationMessages.INVALID_CREDENTIALS
              );
            const {sessionToken,objectId}= response.body
            cy.request({method:'DELETE',
            url: `https://localhost:1337/parse/users/${objectId}`,
            headers: {
                'Conten-Type': 'application/json',
                'X-Parse-Application-Id':'zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA',
                'X-Parse-REST-API-Key':'zHULrh2lOpHoGum0KJRaUSiCl2yYTxHfUZ7Xg9Oa',
                 'X-Parse-Session-Token':sessionToken
              },
             
        })
            
          })
     
    
        
   
       
    })
    it('Invalid Credentials (invalid password)',()=>{
        cy.request({method:'POST', url: 'https://localhost:1337/parse/users',
        headers: {
            'Conten-Type': 'application/json',
            'X-Parse-Application-Id':'zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA',
            'X-Parse-REST-API-Key':'zHULrh2lOpHoGum0KJRaUSiCl2yYTxHfUZ7Xg9Oa',
             'X-Parse-Revocable-Session':'1'
          },
          body:{username:'testos',password:'Dragonfly1977!!', email:'testos@mail.com'}})
          .then(response=>{
              debugger;
            cy.visit('/')
            cy.get('[data-testid=menu]').click()
            cy.get('[data-testid=login]').click()
            cy.get('[data-testid=emailOrUsername]').type('testos')
            cy.get('[data-testid=password]').type('Dragonfly1977!')
            cy.get('[data-testid=login-btn]').click()
            cy.get('[data-testid=message-password]').contains(
                validationMessages.INVALID_CREDENTIALS
              );
              cy.get('[data-testid=message-emailorusername]').contains(
                validationMessages.INVALID_CREDENTIALS
              );
            const {sessionToken,objectId}= response.body
            cy.request({method:'DELETE',
            url: `https://localhost:1337/parse/users/${objectId}`,
            headers: {
                'Conten-Type': 'application/json',
                'X-Parse-Application-Id':'zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA',
                'X-Parse-REST-API-Key':'zHULrh2lOpHoGum0KJRaUSiCl2yYTxHfUZ7Xg9Oa',
                 'X-Parse-Session-Token':sessionToken
              },
             
        })
            
          })
     
    
        
   
       
    })

    it('Empty password',()=>{
        cy.visit('/')
        cy.get('[data-testid=menu]').click()
        cy.get('[data-testid=login]').click()
        cy.get('[data-testid=emailOrUsername]').type('testos')
       // cy.get('[data-testid=password]').type('Dragonfly1977!!')
        cy.get('[data-testid=login-btn]').click()
        cy.get('[data-testid=message-password]').contains(
            validationMessages.INVALID_EMPTY_STRING
          );
    })
    it('Empty emailOrUsername',()=>{
        cy.visit('/')
        cy.get('[data-testid=menu]').click()
        cy.get('[data-testid=login]').click()
       // cy.get('[data-testid=emailOrUsername]').type('testos')
        cy.get('[data-testid=password]').type('Dragonfly1977!!')
        cy.get('[data-testid=login-btn]').click()
        cy.get('[data-testid=message-emailorusername]').contains(
            validationMessages.INVALID_USERNAME_OR_EMAIL
          );
    })

    it('Successfull Login',()=>{
        cy.request({method:'POST', url: 'https://localhost:1337/parse/users',
        headers: {
            'Conten-Type': 'application/json',
            'X-Parse-Application-Id':'zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA',
            'X-Parse-REST-API-Key':'zHULrh2lOpHoGum0KJRaUSiCl2yYTxHfUZ7Xg9Oa',
             'X-Parse-Revocable-Session':'1'
          },
          body:{username:'testos',password:'Dragonfly1977!!', email:'testos@mail.com'}})
          cy.visit('/')
          cy.get('[data-testid=menu]').click()
          cy.get('[data-testid=login]').click()
          cy.get('[data-testid=emailOrUsername]').type('testos')
          cy.get('[data-testid=password]').type('Dragonfly1977!!')
          cy.get('[data-testid=login-btn]').click()
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