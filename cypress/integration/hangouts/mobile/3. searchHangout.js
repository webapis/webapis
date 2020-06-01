describe('searchHangouts', () => {
  beforeEach(() => {
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
            username: 'localuser1',
            email: 'localuser1@gmail.com',
            message: { text: 'Hello', timestamp: 1590984738993 },
            state: 'CHAT',
          },
          {
            username: 'localuser2',
            email: 'localuser2@gmail.com',
            message: { text: 'Hello', timestamp: 1590984738993 },
            state: 'CHAT',
          },
        ])
      );
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.wait(50);
    cy.get('[data-testid=hangouts]').click();
  });
  it('fetch hangout from server', () => {
    cy.server();
    //cy.route({ url: '/users/find?search=testuser', response: [] });
    cy.route({
      url: '/hangouts/find?search=userfromserver',
      response: {
        hangouts: [{ username: 'userfromserver', email: 'userfromserver@gmail.com' }],
      },
    });
  });

  it('search from local hangouts', () => {
    cy.get('[data-testid=search-input]').type('localuser1');
    cy.get('[data-testid=hangouts-list]').children().should('have.length', 1);
  });

  it.only('search from server FETCH_HANGOUT_SUCCESS', () => {
    cy.get('[data-testid=search-input]').type('userfromserver');
    //cy.get('[data-testid=hangouts-list]').children().should('have.length', 1);

  });
  it('search from server FETCH_HANGOUT_NOT_FOUND', () => {});
});
