describe('searchHangouts', () => {
  beforeEach(() => {
    cy.server();
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

  it('search from local hangouts', () => {
    cy.get('[data-testid=search-input]').type('localuser1');
    cy.get('[data-testid=search-btn]').click();
    cy.get('[data-testid=hangouts-list]').children().should('have.length', 1);
  });

  it('search from server FETCH_HANGOUT_SUCCESS', () => {
    cy.route({
      url: '/hangouts/find?search=userfromserver',
      response: {
        hangouts: [{ username: 'userfromserver', email: 'userfromserver@gmail.com' }],
      },
    });
    cy.get('[data-testid=search-input]').type('userfromserver');
    cy.get('[data-testid=search-btn]').click();
    cy.get('[data-testid=hangouts-list]').children().should('have.length', 1);
    cy.get('[data-testid=userfromserver]')
  });
  it('search from server FETCH_HANGOUT_NOT_FOUND', () => {
    cy.route({
      url: '/users/find?search=newuser', response: {
        users: [{ username: 'newuser', email: 'newuser@gmail.com' }],
      }
    });

    cy.route({
      url: '/hangouts/find?search=newuser', response: {
        hangouts: [],
      }
    });
    cy.get('[data-testid=search-input]').type('newuser');
    cy.get('[data-testid=search-btn]').click();
    cy.get('[data-testid=users-list]').children().should('have.length', 1);
    cy.get('[data-testid=newuser]')

  });

  it('search from server FETCH_HANGOUT_FAILED')
  it('E2E')
});
