import infoMessages from "../../../client/features/hangouts/ui-components/infoMessages";
import testProtocols from "./testProtocols";
describe("Test hangout with mocked backend", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });
  it("Invitation", () => {
    cy.invitation();
  });

  it("Block user from sending message", () => {
    cy.block();
  });

  it("Unblock user ", () => {
    cy.unblock();
  });

  it("decline invitation", () => {
    cy.decline();
  });

  it("bero undeclines invitation", () => {
    cy.undecline();
  });

  it("User not fount, Invite as a Guest", () => {
    cy.inviteasguest();
  });

  it("Test Hangout server", () => {});
});
