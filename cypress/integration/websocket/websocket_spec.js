describe("Testing websocket", () => {
  it("Testing websocket", () => {
    cy.visit("https://localhost:3002");

    cy.get("[data-testid=democlient]");
    cy.get("[data-testid=beroclient]");
  });
});
