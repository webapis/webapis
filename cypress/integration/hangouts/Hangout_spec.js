import infoMessages from "../../../client/features/hangouts/ui-components/infoMessages";
import testProtocols from "./testProtocols";

describe("Test websocket", () => {
  it.skip("websocket", () => {
    cy.websocket();
  });
});
[3005, 3004, 3006].forEach((PORT) => {
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
      cy.window()
        .its("localStorage")
        .invoke("setItem", "browserId", "BID1234567890");

      if (PORT === 3006) {
        cy.task("seed:deleteCollection", {
          dbName: "auth",
          collectionName: "users",
        });

        cy.task("seed:user", {
          email: "demouser@gmail.com",
          username: "demouser",
          password: "TestPassword!22s",
        });
        cy.task("query:mongodb", {
          username: "demouser",
        }).then((result) => {
          const { email, username, browsers } = result;
          let actual = { email, username, browsers };
          let expected = {
            email: "demouser@gmail.com",
            username: "demouser",
            browsers: [
              {
                browserId: "BID1234567890",
              },
            ],
          };
          expect(actual).to.deep.equal(expected);
        });
        cy.task("seed:user", {
          email: "berouser@gmail.com",
          username: "berouser",
          password: "TestPassword!22s",
        });
        cy.task("query:mongodb", {
          username: "berouser",
        }).then((result) => {
          const { email, username, browsers } = result;
          let actual = { email, username, browsers };
          let expected = {
            email: "berouser@gmail.com",
            username: "berouser",
            browsers: [
              {
                browserId: "BID1234567890",
              },
            ],
          };
          expect(actual).to.deep.equal(expected);
        });
      }
    });

    it("Invitation", () => {
      cy.invitation({ PORT });
    });

    it("Block user from sending message", () => {
      cy.block({ PORT });
    });

    it("Unblock user", () => {
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
