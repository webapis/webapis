describe("HangoutSpec", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("Hangout spec test", () => {
    cy.server();
    cy.route({
      url: "/authed-msg/hangouts/findOne?search=berouser&username=demouser",
      response: {
        hangout: {
          target: "berouser",
          state: "INVITEE",
          email: "berouser@gmail.com",
        },
      },
    });
    cy.get("[data-testid=democlient]")
      .find("[data-testid=hangouts-btn]")
      .click();
    cy.get("[data-testid=democlient]")
      .find("[data-testid=user-search-input]")
      .type("berouser");
    cy.get("[data-testid=democlient]")
      .find("[data-testid=user-search-button]")
      .click();

    cy.get("[data-testid=democlient]").find("[data-testid=berouser]").click();
    cy.pause();
    cy.get("[data-testid=democlient]")
      .find("[data-testid=oninvite-btn]")
      .click();
  });
});
