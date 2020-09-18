describe("Testing websocket", () => {
  it("Testing websocket", () => {
    cy.visit("https://localhost:3002");

    cy.get("[data-testid=democlient]")
      .find("[data-testid=connectionstate]")
      .contains("open");
    cy.get("[data-testid=beroclient]")
      .find("[data-testid=connectionstate]")
      .contains("open");
    //demo send  a message
    cy.get("[data-testid=democlient]")
      .find("[data-testid=message-input]")
      .type("Hello bero");

    cy.get("[data-testid=democlient]").find("[data-testid=send-btn]").click();

    //bero recieves a message
    cy.get("[data-testid=beroclient]").contains("Hello bero");

    //bero send a message
    cy.get("[data-testid=beroclient]")
      .find("[data-testid=message-input]")
      .type("Hello demo");

    cy.get("[data-testid=beroclient]").find("[data-testid=send-btn]").click();
    //demo recieves a message
    cy.get("[data-testid=democlient]").contains("Hello demo");
  });
});
