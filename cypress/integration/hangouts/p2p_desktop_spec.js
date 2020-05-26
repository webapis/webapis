describe('p2p desktop', () => {
  beforeEach(() => {
    cy.viewport(1002, 700);
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
  });

  it('user invokes Chat', () => {
    cy.window()
      .its('localStorage')
      .invoke(
        'setItem',
        'contacts-testuser',
        JSON.stringify({
          contacts: [
            { username: 'user1', email: 'user1@gmail.com', room: 'room-one' },
            { username: 'bred', email: 'bred@gmail.com', room: 'room-two' },
            {
              username: 'dragos',
              email: 'dragos@gmail.com',
              room: 'room-three',
            },
          ],
        })
      );

    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=p2p]').click();
    cy.get('[data-testid=p2p-desktop]');
    cy.get('[data-testid=contacts-list]').children().should('have.length', 3);
    cy.get('[data-testid=contacts-list]').children().contains('bred').click();
    cy.get('[data-testid=contacts-list]').children().contains('dragos').click();
    cy.get('[data-testid=chat-views]').children().should('have.length', 2);
  });
  it('user invokes Invitation', () => {
    cy.server();
    cy.route({
      url: '/users/find?filter=bred',
      response: { users: [{ username: 'bred', email: 'bred@gmail.com' }] },
    });
    cy.route({
      url: '/users/find?filter=dragos',
      response: { users: [{ username: 'dragos', email: 'dragos@gmail.com' }] },
    });

    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();

    cy.get('[data-testid=p2p]').click();

    cy.get('[data-testid=contact-search]').type('bred');
    cy.get('[data-testid=contacts-list]').children().should('have.length', 1);
    cy.get('[data-testid=contacts-list]').children().contains('bred').click();
    cy.get('[data-testid=contact-search]').clear();
    cy.get('[data-testid=contact-search]').type('dragos');
    cy.get('[data-testid=contacts-list]').children().contains('dragos').click();
    cy.get('[data-testid=invitation-views]')
      .children()
      .should('have.length', 2);
  });
});
