import infoMessages from "../../../client/features/hangouts/ui-components/infoMessages";
import testProtocols from "./testProtocols";

describe("Test websocket", () => {
  it.skip("websocket", () => {
    cy.websocket();
  });
}); //3004,3005,3006
[3006 /*, 3004, 3006*/].forEach((PORT) => {
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
      // cy.viewport(1280, 720);
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
    if (PORT === 3006 || PORT === 3005) {
      it("targetOffline invitation", () => {
        cy.targetOfflineInvitation({ PORT });
      });
    }

    it("invitation senderOffline", () => {
      cy.senderOfflineInvitation({ PORT });
    });

    it("Search for new user by username: found new user", () => {
      cy.findNewUser({ username: "berouser", PORT: 3006 });
      cy.get("[data-testid=democlient]").find("[data-testid=berouser]");
      cy.wait("@searchByUsername").then(async (xhr) => {
        const response = await new Response(xhr.responseBody).json();
        expect(response).to.deep.equal({
          hangout: {
            target: "berouser",
            email: "berouser@gmail.com",
            state: "INVITEE",
          },
        });
        debugger;
      });
    });

    it("Search for new user by email: found new user", () => {
      cy.findNewUser({ email: "berouser@gmail.com", PORT: 3006 });
      cy.get("[data-testid=democlient]").find("[data-testid=berouser]");
      cy.wait("@searchByEmail").then(async (xhr) => {
        const response = await new Response(xhr.responseBody).json();
        expect(response).to.deep.equal({
          hangout: {
            target: "berouser",
            email: "berouser@gmail.com",
            state: "INVITEE",
          },
        });
        debugger;
      });
    });

    it("Search for new user by username: new user not found", () => {
      cy.findNewUser({ username: "tempuser", PORT: 3006 });
      cy.get("[data-testid=democlient]").find("[data-testid=invite-guest]");
    });
    it("Search for new user by email: new user not found", () => {
      cy.findNewUser({ username: "tempuser@gmail.com", PORT: 3006 });
      cy.get("[data-testid=democlient]").find("[data-testid=invite-guest]");
    });

    it("Fetch remote hangouts", () => {
      if (PORT === 3006) {
        let userOne = {
          target: "userone",
          email: "userone@gmail.com",
          state: "MESSAGER",
          timestampe: 1543536000000,
          message: { text: "Hello userone", timestamp: 1543536000000 },
          browserId: "BID1234567890",
        };

        let userTwo = {
          target: "usertwo",
          email: "usertwo@gmail.com",
          state: "MESSAGER",
          timestampe: 1543536000000,
          message: { text: "Hello usertwo", timestamp: 1543536000000 },
          browserId: "BID1234567890",
        };
        let userThree = {
          target: "userthree",
          email: "userthree@gmail.com",
          state: "MESSAGER",
          timestampe: 1543536000000,
          message: { text: "Hello userthree", timestamp: 1543536000000 },
          browserId: "BID1234567890",
        };
        let userFour = {
          target: "userfour",
          email: "userfour@gmail.com",
          state: "MESSAGER",
          timestampe: 1543536000000,
          message: { text: "Hello userfour", timestamp: 1543536000000 },
          browserId: "BID1234567890",
        };
        cy.task("seed:hangout", {
          username: "demouser",
          hangout: userOne,
        });
        cy.task("seed:hangout", {
          username: "demouser",
          hangout: userTwo,
        });
        cy.task("seed:hangout", {
          username: "demouser",
          hangout: userThree,
        });

        cy.task("seed:hangout", {
          username: "demouser",
          hangout: userFour,
        });
      }
      cy.visit(`https://localhost:${PORT}`);

      cy.task("query:mongodb", {
        username: "demouser",
      }).then((result) => {
        const { browsers } = result;

        expect(browsers.length).to.equal(1);

        const browser = browsers[0];
        const { hangouts } = browser;
        expect(hangouts.length).to.equal(4);
      });

      cy.get("[data-testid=democlient]").find("#connect").click();
      cy.get("[data-testid=beroclient]").find("#connect").click();
    });
    it("Load local hangouts", () => {
      cy.window()
        .its("localStorage")
        .invoke(
          "setItem",
          "demouser-hangouts",
          JSON.stringify([
            {
              target: "userone",
              email: `userone@gmail.com`,
              state: "MESSANGER",
            },
          ])
        );
      cy.window()
        .its("localStorage")
        .invoke(
          "setItem",
          "berouser-hangouts",
          JSON.stringify([
            {
              target: "userone",
              email: `userone@gmail.com`,
              state: "MESSANGER",
            },
          ])
        );

      cy.visit(`https://localhost:${PORT}`);
    });

    it.only("Filter hangouts", () => {
      cy.window()
        .its("localStorage")
        .invoke(
          "setItem",
          "demouser-hangouts",
          JSON.stringify([
            {
              target: "userone",
              email: `userone@gmail.com`,
              state: "MESSANGER",
            },
            {
              target: "usertwo",
              email: `usertwo@gmail.com`,
              state: "MESSANGER",
            },
            {
              target: "userthree",
              email: `userthree@gmail.com`,
              state: "MESSANGER",
            },
            {
              target: "userfour",
              email: `userfour@gmail.com`,
              state: "MESSANGER",
            },
          ])
        );

      cy.visit(`https://localhost:${PORT}`);
    });
  });
});
