describe('selectHangout', () => {
  beforeEach(() => {
    //cy.task('seed:hangouts', {});
    //cy.viewport(500, 500);
    cy.login({
      username: 'demo',
      email: 'demo@gmail.com',
      password: 'Dragonfly1977!!!',
    });
    cy.window()
      .its('localStorage')
      .invoke(
        'setItem',
        'demo-hangouts',
        JSON.stringify([
          {
            username: 'inviteuser',
            email: 'inviteuser@gmail.com',
            message: { text: 'Hello', timestamp: 1590984738993, },state: 'INVITE' 
          },
          {
            username: 'inviteruser',
            email: 'inviteruser@gmail.com',
            message: { text: 'Hello', timestamp: 1590984738993},state: 'INVITER' 
          },
          {
            username: 'inviteeuser',
            email: 'inviteeuser@gmail.com',
            message: { text: 'Hello', timestamp: 1590984738993},state: 'INVITEE' 
          }
          ,
          {
            username: 'blockeduser',
            email: 'blockeduser@gmail.com',
            message: { text: 'Hello', timestamp: 1590984738993},state: 'BLOCKED' 
          }
          ,
          {
            username: 'hangchatuser',
            email: 'hangchatuser@gmail.com',
            message: { text: 'Hello', timestamp: 1590984738993},state: 'HANGCHAT' 
          }
        ])
      );
    // cy.remoteLogin({
    //   username: 'remote',
    //   email: 'remote@gmail.com',
    //   password: 'Dragonfly1977!!!',
    // });

    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.wait(50);
    cy.get('[data-testid=hangouts]').click();
  });
  it('INVITE state', () => {
    cy.get('[data-testid=inviteuser]').click();
    cy.get('[data-testid=invite-ui]')
  });
  it('INVITER state', () => {
    cy.get('[data-testid=inviteruser]').click();
    cy.get('[data-testid=inviter-ui]')
  });
  it('INVITEE state', () => {
    cy.get('[data-testid=inviteeuser]').click();
    cy.get('[data-testid=invitee-ui]')
  });
  it('BLOCKED state', () => {
    cy.get('[data-testid=blockeduser]').click();
    cy.get('[data-testid=blocked-ui]')
  });
  it('HANGCHAT state', () => {
    cy.get('[data-testid=hangchatuser]').click();
    cy.get('[data-testid=hangchat-ui]')
  });
});
