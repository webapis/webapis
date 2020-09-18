describe("Testing websocket", () => {
  it("Testing websocket", () => {
    cy.visit("https://localhost:3002");

    cy.get("[data-testid=democlient]")
      .find("[data-testid=connectionstate]")
      .contains("open");
    cy.get("[data-testid=beroclient]")
      .find("[data-testid=connectionstate]")
      .contains("open");

    cy.get("[data-testid=democlient]")
      .find("[data-testid=message-input]")
      .type("Hello bero");
    cy.pause();
    cy.get("[data-testid=democlient]").find("[data-testid=send-btn]").click();
  });
});
