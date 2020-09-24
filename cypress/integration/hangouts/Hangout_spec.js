import infoMessages from "../../../client/features/hangouts/ui-components/infoMessages";
import testProtocols from "./testProtocols";

describe("Test websocket", () => {
  it("websocket", () => {
    cy.websocket();
  });
});
[3005, 3004].forEach((PORT) => {
  let backend = null;
  if (PORT === 3005) {
    backend = "RtcMock";
  } else if (PORT === 3004) {
    backend = "RtcWs";
  } else {
    backend = "RtcWsMongo";
  }
  describe(`Test hangout with ${backend}`, () => {
    beforeEach(() => {
      cy.viewport(1280, 720);
    });

    it("Invitation", () => {
      cy.invitation({ PORT });
    });

    it("Block user from sending message", () => {
      cy.block({ PORT });
    });

    it("Unblock user ", () => {
      cy.unblock({ PORT });
    });

    it("decline invitation", () => {
      cy.decline({ PORT });
    });

    it("bero undeclines invitation", () => {
      cy.undecline({ PORT });
    });

    it("User not fount, Invite as a Guest", () => {
      cy.inviteasguest({ PORT });
    });
  });
});
