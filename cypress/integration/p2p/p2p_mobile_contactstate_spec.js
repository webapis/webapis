describe('p2p_invitation', () => {
  beforeEach(() => {
    cy.viewport(700, 700);
    cy.window()
      .its('localStorage')
      .invoke(
        'setItem',
        'webcom',
        JSON.stringify({
          username: 'testuser',
          email: 'testuser@gmail.com',
          token: '123',
        })
      );
    cy.window()
      .its('localStorage')
      .invoke(
        'setItem',
        'contacts-testuser',
        JSON.stringify({
          contacts: [
            {
              username: 'bred',
              email: 'bred@gmail.com',
              state: 'invitee',
            },
            {
              username: 'user1',
              email: 'user1@gmail.com',
              state: 'inviter',
              message: { text: 'Lets chat!', datetime: 'Now' },
            },

            {
              username: 'dragos',
              email: 'dragos@gmail.com',
              state: 'blocked',
            },
            {
              username: 'user2',
              email: 'user2@gmail.com',
              state: 'invite',
              message: { text: 'Lets chat!', datetime: 'Now' },
            },
            {
              username: 'user3',
              email: 'user3@gmail.com',
              state: 'chat',
              messages: [
                {
                  message: 'hello mario 2',
                  local: true,
                  from: 'user3',
                  to: 'mario',
                  datetime: new Date(
                    'Wed, 27 July 2019 07:46:00 GMT'
                  ).getTime(),
                },
              ],
            },
          ],
        })
      );
  });
  it('Invitee', () => {
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=p2p]').click();
    cy.get('[data-testid=contacts-list]').children().contains('bred').click();
  });
  it('Inviter', () => {
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=p2p]').click();

    cy.get('[data-testid=contacts-list]').children().contains('user1').click();
  });

  it('Blocked', () => {
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=p2p]').click();

    cy.get('[data-testid=contacts-list]').children().contains('dragos').click();
  });

  it('Invite', () => {
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=p2p]').click();

    cy.get('[data-testid=contacts-list]').children().contains('user2').click();
  });

  it('chat', () => {
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=p2p]').click();

    cy.get('[data-testid=contacts-list]').children().contains('user3').click();
  });
  it('Block', () => {
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=p2p]').click();
    cy.get('[data-testid=contacts-list]').children().contains('user3').click();
    cy.get('[data-testid=setting]').click();
    cy.get('[data-testid=block-btn]').click();
    cy.get('[ data-testid=block]');
  });
  it('Configure', () => {
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=p2p]').click();
    cy.get('[data-testid=contacts-list]').children().contains('user3').click();
    cy.get('[data-testid=setting]').click();
    cy.get('[data-testid=configure]');
  });
});
