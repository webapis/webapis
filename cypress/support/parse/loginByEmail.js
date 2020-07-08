Cypress.Commands.add('loginParse', ({ email, password }) => {
    var params = {
        username: email,
        password,

    };
    var formData = new FormData();

for (var k in params) {
    formData.append(k, params[k]);
}
    cy.request({
        method: 'GET', url: `https://localhost:1337/parse/login?username=${email}&password=${password}`, form: true,
        headers: {
            'Conten-Type': 'application/json',
            'X-Parse-Application-Id': 'zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA',
            'X-Parse-REST-API-Key': 'zHULrh2lOpHoGum0KJRaUSiCl2yYTxHfUZ7Xg9Oa',
            "X-Parse-Revocable-Session": "1"
        
        }
    }).then(response=>{
        const {sessionToken,objectId,email,username}=response.body
        
        cy.window().its('localStorage').invoke('setItem','webcom',JSON.stringify({username,email,token:sessionToken,objectId}))
        cy.window().its('localStorage').invoke('setItem',username,JSON.stringify({username,email,token:sessionToken,objectId}))
    })

})