import infoMessages from "../../../client/features/hangouts/ui-components/infoMessages";
import testProtocols from "./testProtocols";
describe("Test hangout with mocked backend", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });
  it("websocket", () => {
    cy.websocket();
  });

  it("Invitation", () => {
    cy.invitation({ PORT: 3005 });
  });

  it("Block user from sending message", () => {
    cy.block({ PORT: 3005 });
  });

  it("Unblock user ", () => {
    cy.unblock({ PORT: 3005 });
  });

  it("decline invitation", () => {
    cy.decline({ PORT: 3005 });
  });

  it("bero undeclines invitation", () => {
    cy.undecline({ PORT: 3005 });
  });

  it("User not fount, Invite as a Guest", () => {
    cy.inviteasguest({ PORT: 3005 });
  });
});

describe("Test hangout with ws", () => {
  it("Invitation", () => {
    cy.invitation({ PORT: 3004 });
  });
  it("Block user from sending message", () => {
    cy.block({ PORT: 3004 });
  });

  it("Unblock user ", () => {
    cy.unblock({ PORT: 3004 });
  });

  it("decline invitation", () => {
    cy.decline({ PORT: 3004 });
  });

  it("bero undeclines invitation", () => {
    cy.undecline({ PORT: 3004 });
  });
});
