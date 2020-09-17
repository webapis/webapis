import infoMessages from "../../../client/features/hangouts/ui-components/infoMessages";
describe("HangoutSpec", () => {
  beforeEach(() => {});
  it("demouser invites berouser and berouser accepts", () => {
    cy.visit("/");
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
    //demo user sends an invitation
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
    // cy.pause();
    //berouser accepts a message
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

    //demouser send a message
    cy.get("[data-testid=democlient]")
      .find("[data-testid=message-input]")
      .should("be.enabled");
    cy.get("[data-testid=democlient]")
      .find("[data-testid=send-btn]")
      .should("be.enabled");

    cy.get("[data-testid=democlient]")
      .find("[data-testid=message-input]")
      .type("Hello Bero how are you");
    cy.get("[data-testid=democlient]").find("[data-testid=send-btn]").click();

    //berouser send a messages
    cy.get("[data-testid=beroclient]")
      .find("[data-testid=message-input]")
      .type("I am fine how are you demo.");
    cy.get("[data-testid=beroclient]").find("[data-testid=send-btn]").click();
  });

  it("Bero Blocks Demo", () => {
    cy.window()
      .its("localStorage")
      .invoke(
        "setItem",
        "beroInitState",
        JSON.stringify({
          data: {
            type: "HANGOUT",
            hangout: {
              target: "demouser",
              email: "demouser@gmail.com",
              state: "MESSANGER",
              timestamp: Date.now(),
              message: {
                text: "Hello Bero How are you",
                timestamp: Date.now(),
              },
            },
          },
          type: "HANGOUT",
        })
      );

    cy.window()
      .its("localStorage")
      .invoke(
        "setItem",
        "demoInitState",
        JSON.stringify({
          data: {
            type: "HANGOUT",
            hangout: {
              target: "berouser",
              email: "berouser@gmail.com",
              state: "MESSANGER",
              timestamp: Date.now(),
              message: {
                text: "Hello Demo How are you",
                timestamp: Date.now(),
              },
            },
          },
          type: "HANGOUT",
        })
      );
    cy.visit("/");

    //bero views new message
    cy.get("[data-testid=beroclient]")
      .find("[data-testid=unread-link]")
      .click();
    cy.get("[data-testid=beroclient]").find("[data-testid=unread-ui]");
    cy.get("[data-testid=beroclient]").find("[data-testid=demouser]").click();
    //demo views new message
    cy.get("[data-testid=democlient]")
      .find("[data-testid=unread-link]")
      .click();
    cy.get("[data-testid=democlient]").find("[data-testid=unread-ui]");
    cy.get("[data-testid=democlient]").find("[data-testid=berouser]").click();

    // berouser blocks demouser
    // test config-btn
    cy.get("[data-testid=beroclient]").find("[data-testid=config-btn]").click();
    //test config-close-btn
    cy.get("[data-testid=beroclient]")
      .find("[data-testid=config-close-btn]")
      .click();

    //test block-btn
    cy.get("[data-testid=beroclient]").find("[data-testid=config-btn]").click();
    cy.get("[data-testid=beroclient]").find("[data-testid=bckui-btn]").click();
    cy.get("[data-testid=beroclient]").find("[data-testid=block-btn]").click();

    //demouser will try to send a message to blocked user
    cy.get("[data-testid=democlient]")
      .find("[data-testid=message-input]")
      .type("Hi bero hope you have not blovked me");
    cy.get("[data-testid=democlient]").find("[data-testid=send-btn]").click();
  });

  it("Bero unblocks demouser", () => {
    cy.window()
      .its("localStorage")
      .invoke(
        "setItem",
        "berouser-hangouts",
        JSON.stringify([
          {
            target: "demouser",
            email: "demouser@gmail.com",
            state: "BLOCKED",
            timestamp: Date.now(),
            message: {
              text: "",
              timestamp: Date.now(),
            },
          },
        ])
      );
    cy.window()
      .its("localStorage")
      .invoke(
        "setItem",
        "berouser-demouser-messages",
        JSON.stringify([
          {
            text: "",
            datetime: Date.now(),
            owner: "berouser",
            type: "blocked",
            state: "delivered",
          },
        ])
      );
    cy.visit("/");
    //bero
    cy.get("[data-testid=beroclient]").find("[data-testid=demouser]").click();
    cy.get("[data-testid=beroclient]").find("[data-testid=config-btn]").click();
    cy.get("[data-testid=beroclient]")
      .find("[data-testid=blocked-ui-btn]")
      .click();
    cy.get("[data-testid=beroclient]")
      .find("[data-testid=unblock-btn]")
      .click();

    //demo views new message
    cy.get("[data-testid=democlient]")
      .find("[data-testid=unread-link]")
      .click();
    cy.get("[data-testid=democlient]").find("[data-testid=unread-ui]");
    cy.get("[data-testid=democlient]").find("[data-testid=berouser]").click();
  });

  it("bero declines invitation", () => {
    cy.window()
      .its("localStorage")
      .invoke(
        "setItem",
        "demouser-hangouts",
        JSON.stringify([
          {
            target: "berouser",
            email: "berouser@gmail.com",
            state: "INVITED",
            message: {
              text: "Lets chat bero",
              timestamp: Date.now(),
            },
            timestamp: Date.now(),
          },
        ])
      );

    cy.window()
      .its("localStorage")
      .invoke(
        "setItem",
        "demouser-berouser-messages",
        JSON.stringify([
          {
            owner: "demouser",
            text: "Lets chat bero",
            timestamp: Date.now(),
            state: "delivered",
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
            target: "demouser",
            email: "demouser@gmail.com",
            state: "INVITER",
            message: {
              text: "Lets chat bero",
              timestamp: Date.now(),
            },
            timestamp: Date.now(),
          },
        ])
      );

    cy.window()
      .its("localStorage")
      .invoke(
        "setItem",
        "berouser-demouser-messages",
        JSON.stringify([
          {
            owner: "demouser",
            text: "Lets chat bero",
            timestamp: Date.now(),
            state: "delivered",
          },
        ])
      );
    cy.visit("/");

    cy.get("[data-testid=beroclient]").find("[data-testid=demouser]").click();
    cy.get("[data-testid=beroclient]")
      .find("[data-testid=decline-btn]")
      .click();
  });

  it("bero undeclines invitation", () => {
    cy.window()
      .its("localStorage")
      .invoke(
        "setItem",
        "berouser-hangouts",
        JSON.stringify([
          {
            target: "demouser",
            email: "demouser@gmail.com",
            state: "DECLINED",
            timestamp: Date.now(),
            message: { text: "", type: "declined", timestamp: Date.now() },
          },
        ])
      );

    cy.window()
      .its("localStorage")
      .invoke(
        "setItem",
        "berouser-demouser-messages",
        JSON.stringify([
          {
            text: "",
            type: "declined",
            timestamp: Date.now(),
            owner: "berouser",
            state: "delivered",
          },
        ])
      );

    cy.visit("/");
    cy.get("[data-testid=beroclient]").find("[data-testid=demouser]").click();
    cy.get("[data-testid=beroclient]").find("[data-testid=config-btn]").click();
    cy.get("[data-testid=beroclient]")
      .find("[data-testid=declined-ui-btn]")
      .click();
    cy.get("[data-testid=beroclient]")
      .find("[data-testid=undecline-btn]")
      .click();
  });
});
