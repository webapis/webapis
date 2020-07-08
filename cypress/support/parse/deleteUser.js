Cypress.Commands.add('deleteUserParse',({username})=>{
    const headers ={
        'Conten-Type': 'application/json',
        'X-Parse-Application-Id':'zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA',
        'X-Parse-REST-API-Key':'zHULrh2lOpHoGum0KJRaUSiCl2yYTxHfUZ7Xg9Oa',
    }
    cy.window().its('localStorage').invoke('getItem',username).then(result=>{
 
        const {objectId,token}= JSON.parse(result)
    

    cy.request({method:'DELETE',url:`https://localhost:1337/parse/users/${objectId}`, headers:{
        ...headers,
        'X-Parse-Session-Token':token
    }}).then((response)=>{
        //fetch HangoutUser
        cy.request({method:'GET',url:`https://localhost:1337/parse/classes/HangoutUser?where=${JSON.stringify({userid:objectId})}`,headers, form: true}).then(response=>{
            const {results}=response.body
            const {objectId}=results[0]
            // delete HangoutUser
            cy.request({method:'DELETE',url:`https://localhost:1337/parse/classes/HangoutUser/${objectId}`,headers})

            
        })

        //fetch Hangout
        cy.request({method:'GET',headers,url:`https://localhost:1337/parse/classes/Hangout?where= ${JSON.stringify({userid:objectId})}`,form:true })
        .then(response=>{
            //delete Hangout
            const {results}=response.body
            const {objectId}=results[0]
            // delete HangoutUser
            cy.request({method:'DELETE',url:`https://localhost:1337/parse/classes/Hangout/${objectId}`,headers})
        })
    
    })

})
})