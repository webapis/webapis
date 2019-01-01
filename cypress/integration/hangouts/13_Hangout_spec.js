import infoMessages from "../../../client/features/hangouts/ui-components/infoMessages";
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

    cy.get("[data-testid=democlient]")
      .find("[data-testid=oninvite-btn]")
      .click();
    cy.get("[data-testid=democlient]")
      .find("[data-testid=info-message]")
      .contains(infoMessages.invited);
    cy.get("[data-testid=democlient]")
      .find("[data-testid=message-input]")
      .should("be.disabled");
    cy.get("[data-testid=democlient]")
      .find("[data-testid=send-btn]")
      .should("be.disabled");
    cy.pause();
    //berouser
    cy.get("[data-testid=beroclient]")
      .find("[data-testid=message-count]")
      .contains(1);
    cy.get("[data-testid=beroclient]")
      .find("[data-testid=unread-link]")
      .click();
    cy.get("[data-testid=beroclient]").find("[data-testid=unread-ui]");
    cy.get("[data-testid=beroclient]").find("[data-testid=demouser]").click();
    cy.get("[data-testid=beroclient]")
      .find("[data-testid=message-count]")
      .contains(0);

    cy.get("[data-testid=beroclient]").find("[data-testid=accept-btn]").click();

    //demouser
    cy.get("[data-testid=democlient]")
      .find("[data-testid=message-input]")
      .should("be.enabled");
    cy.get("[data-testid=democlient]")
      .find("[data-testid=send-btn]")
      .should("be.enabled");
  });
});
