Cypress.Commands.add("createUser", ({ email, username, password }) => {
  cy.request({
    url: "https://localhost:1337/parse/users",
    method: "POST",
    headers: {
      "Conten-Type": "application/json",
      "X-Parse-Application-Id": "zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA",
      "X-Parse-REST-API-Key": "zHULrh2lOpHoGum0KJRaUSiCl2yYTxHfUZ7Xg9Oa",
    },
    body: { username, password, email },
  }).then((response) => {
    const { sessionToken, objectId } = response.body;
    cy.window()
      .its("localStorage")
      .invoke(
        "setItem",
        username,
        JSON.stringify({ token: sessionToken, username, email, objectId })
      );
    cy.request({
      url: "https://localhost:1337/parse/classes/HangoutUser",
      method: "POST",
      headers: {
        "Conten-Type": "application/json",
        "X-Parse-Application-Id": "zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA",
        "X-Parse-REST-API-Key": "zHULrh2lOpHoGum0KJRaUSiCl2yYTxHfUZ7Xg9Oa",
      },
      body: { userid: objectId, email, username },
    });

    cy.window()
      .its("localStorage")
      .invoke(
        "setItem",
        username,
        JSON.stringify({ username, email, token: sessionToken, objectId })
      );
  });
});
