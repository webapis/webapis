import deviceType from '../../../client/layout/deviceType';
describe('onHangout', () => {
  beforeEach(() => {
    const demo = {
      username: 'demo',
      email: 'demo@gmail.com',
      password: 'Dragonfly1977!!!',
    };
    const bero = {
      username: 'bero',
      email: 'bero@gmail.com',
      password: 'Dragonly_1999!',
    };
    cy.task('seed:deleteCollection', {
      dbName: 'auth',
      collectionName: 'users',
    });
    cy.task('seed:user', demo);
    cy.task('seed:user', bero);
    cy.viewport(deviceType.phone, 600);
    //cy.window().its('localStorage').invoke('removeItem', 'bero-hangouts');
  });
  describe('onInvite and onAccept', () => {
    it('onInvite and Accept', () => {
      // onInvite
      cy.loginByEmail({
        email: 'demo@gmail.com',
        password: 'Dragonfly1977!!!',
      });
      cy.visit('/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.wait(50);
      cy.get('[data-testid=hangouts]').click();
      cy.get('[data-testid=search-input]').type('bero');
      cy.get('[data-testid=search-btn]').click();
      cy.get('[data-testid=bero]').click();
      cy.get('[data-testid=invite-ui]');
      cy.get('[data-testid=messageTextInput]').type('Lets chat on Hangout');

      cy.get('[data-testid=oninvite-btn]').click();
      cy.get('[data-testid=invitee-ui]');
    //  cy.get('.message-font-phone-size')
      //cy.pause()
      cy.visit('/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.get('[data-testid=hangouts]').click();
      cy.get('[data-testid=bero]').click();
      cy.get('[data-testid=invitee-ui]');

      // //--- onAccept
     
      cy.loginByEmail({
        email: 'bero@gmail.com',
        password: 'Dragonly_1999!',
      });
      cy.visit('/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.wait(50);
      cy.get('[data-testid=hangouts]').click();
      cy.get('[data-testid=demo]').click();
      cy.get('[data-testid=accept-btn]').click();
      cy.get('[data-testid=hangchat-ui]');
      // bero sends message
      cy.get('[data-testid=message-input]').type('Ok demo lets chat!');
      cy.get('[data-testid=send-btn]').click();
      cy.get('[data-testid=message]').contains('Ok demo lets chat!');

  
      // demo recieves the message
      cy.loginByEmail({
        email: 'demo@gmail.com',
        password: 'Dragonfly1977!!!',
      });
      cy.visit('/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.wait(50);
      cy.get('[data-testid=hangouts]').click();
      cy.get('[data-testid=bero]').click();
      cy.get('[data-testid=message]').contains('Ok demo lets chat!');
    });
  });

  describe('onInvite and onDecline', () => {
    it('onInvite and onDecline(block)', () => {
      // onInvite
      cy.loginByEmail({
        email: 'demo@gmail.com',
        password: 'Dragonfly1977!!!',
      });
      cy.visit('/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.wait(50);
      cy.get('[data-testid=hangouts]').click();
      cy.get('[data-testid=search-input]').type('bero');
      cy.get('[data-testid=search-btn]').click();
      cy.get('[data-testid=bero]').click();
      cy.get('[data-testid=invite-ui]');
      cy.get('[data-testid=messageTextInput]').type('Lets chat on Hangout');
      cy.get('[data-testid=oninvite-btn]').click();
      cy.get('[data-testid=invitee-ui]');

      cy.visit('/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.get('[data-testid=hangouts]').click();
      cy.get('[data-testid=bero]').click();
      cy.get('[data-testid=invitee-ui]');

      // //--- onAccept

      cy.loginByEmail({
        email: 'bero@gmail.com',
        password: 'Dragonly_1999!',
      });
      cy.visit('/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.wait(50);
      cy.get('[data-testid=hangouts]').click();
      cy.get('[data-testid=demo]').click();
      cy.get('[data-testid=decline-btn]').click();
      cy.get('[data-testid=blocked-ui]');

      // test inviter side
      cy.visit('/');
      cy.wait(50);
      cy.wait(50);
      // cy.visit('/');
      cy.loginByEmail({
        email: 'demo@gmail.com',
        password: 'Dragonfly1977!!!',
      });
      cy.visit('/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.get('[data-testid=hangouts]').click();
      cy.get('[data-testid=search-input]').type('bero');
      cy.get('[data-testid=search-btn]').click();
      cy.get('[data-testid=bero]').click();
    });
  });

  describe('onMessage and Block and unBlock', () => {
    it('onMessage and Block and unBlock', () => {
      //onInvite:demo
      cy.loginByEmail({
        email: 'demo@gmail.com',
        password: 'Dragonfly1977!!!',
      });
      cy.visit('/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.wait(50);
      cy.get('[data-testid=hangouts]').click();
      cy.get('[data-testid=search-input]').type('bero');
      cy.get('[data-testid=search-btn]').click();
      cy.get('[data-testid=bero]').click();
      cy.get('[data-testid=invite-ui]');
      cy.get('[data-testid=messageTextInput]').type('Lets chat on Hangout');
      cy.get('[data-testid=oninvite-btn]').click();
      cy.get('[data-testid=invitee-ui]');
      //onAccept:bero

      cy.loginByEmail({
        email: 'bero@gmail.com',
        password: 'Dragonly_1999!',
      });
      cy.visit('/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.wait(50);
      cy.get('[data-testid=hangouts]').click();
      cy.get('[data-testid=demo]').click();
      cy.get('[data-testid=accept-btn]').click();
      cy.get('[data-testid=hangchat-ui]');
      //onMessage:demo
      cy.loginByEmail({
        email: 'demo@gmail.com',
        password: 'Dragonfly1977!!!',
      });
      cy.visit('/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.wait(50);
      cy.get('[data-testid=hangouts]').click();
      cy.get('[data-testid=bero]').click();

      cy.get('[data-testid=message-input]').type('You are x');

      cy.get('[data-testid=send-btn]').click();

      //onBlock:bero
      cy.loginByEmail({
        email: 'bero@gmail.com',
        password: 'Dragonly_1999!',
      });
      cy.visit('/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.wait(50);
      cy.get('[data-testid=hangouts]').click();
      cy.get('[data-testid=demo]').click();
      cy.get('[data-testid=nav-config]').click();
     cy.get('[data-testid=bckui-btn]').click();
     cy.get('[data-testid=block-btn]').click();
     cy.get('[data-testid=hangchat-ui]');
     cy.get('[data-testid=blocked-message]').contains('you blocked this user');

      //demo tries to send a message despite but he is blocked
      cy.loginByEmail({
        email: 'demo@gmail.com',
        password: 'Dragonfly1977!!!',
      });
      cy.visit('/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.wait(50);
      cy.get('[data-testid=hangouts]').click();
      cy.get('[data-testid=bero]').click();
      cy.get('[data-testid=hangchat-ui]');
      cy.get('[data-testid=message-input]').type('So you are not x');
      cy.get('[data-testid=send-btn]').click();
      cy.get('[data-testid=blocker-message]').contains(
        'You can not send this message because you are blocked.'
      );

      //let make sure bero did not recieve any message

      cy.loginByEmail({
        email: 'bero@gmail.com',
        password: 'Dragonly_1999!',
      });
      cy.visit('/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.wait(50);
      cy.get('[data-testid=hangouts]').click();
      cy.get('[data-testid=demo]').click();

      //// cy.get('[data-testid=hangchat-ui]').should('not.contain','So you are not x')
      //// cy.get('[data-testid=hangchat-ui]').should('not.contain','you blocked this user')

      // bero UNBLOCKS demo
      cy.get('[data-testid=seemore-btn]').click();
      cy.get('[data-testid=unblock-btn]').click();
      cy.get('[data-testid=message-input]').type('Let talk without x');
      cy.get('[data-testid=send-btn]').click();

   //   is demo is unblocked
      cy.loginByEmail({
        email: 'demo@gmail.com',
        password: 'Dragonfly1977!!!',
      });
      cy.visit('/');
      cy.wait(50);
      cy.get('[data-testid=menu]').click();
      cy.wait(50);
      cy.get('[data-testid=hangouts]').click();
      cy.get('[data-testid=bero]').click();
      cy.get('[data-testid=hangchat-ui]');
      cy.get('[data-testid=message]').contains('Let talk without x');
    });
  });
});
