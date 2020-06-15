Cypress.Commands.add('loginByEmail', ({ email, password }) => {

        cy.request({
          url: 'https://localhost:3000/auth/login',
          method: 'GET',
          headers: {
            'Conten-Type': 'application/json',
            'Access-Control-Allow-Headers': '*',
            Authorization: `Basic ${btoa(`${email}:${password}`)}`,
          },
        })
          .its('body')
          .then((body) => {
            const { email, username, token } = body;
            cy.window()
              .its('localStorage')
              .invoke(
                'setItem',
                'webcom',
                JSON.stringify({ username, email, token })
              );
          });
   
  });