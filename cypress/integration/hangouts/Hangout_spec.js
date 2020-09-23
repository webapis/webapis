import infoMessages from "../../../client/features/hangouts/ui-components/infoMessages";
import testProtocols from "./testProtocols";

describe("Test websocket", () => {
  it("websocket", () => {
    cy.websocket();
  });
});
[3004].forEach((PORT) => {
  let backend = null;
  if (PORT === 3004) {
    backend = "RtcMock";
  } else if (PORT === 3005) {
    backend = "RtcWs";
  } else {
    backend = "RtcWsMongo";
  }
  describe(`Test hangout with ${backend}`, () => {
    beforeEach(() => {
      cy.viewport(1280, 720);
    });

    it.only("Invitation", () => {
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

// describe("Test hangout with ws", () => {
//   it("Invitation", () => {
//     cy.invitation({ PORT: 3004 });
//   });
//   it("Block user from sending message", () => {
//     cy.block({ PORT: 3004 });
//   });

//   it("Unblock user ", () => {
//     cy.unblock({ PORT: 3004 });
//   });

//   it("decline invitation", () => {
//     cy.decline({ PORT: 3004 });
//   });

//   it("bero undeclines invitation", () => {
//     cy.undecline({ PORT: 3004 });
//   });
// });

// describe("Test Hangout with ws and mongodb", () => {
//   it.only("Invitation", () => {
//     cy.invitation({ PORT: 3006 });
//   });
// });
