describe('Contacts', () => {
  beforeEach(() => {
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

  it('user has local contacts', () => {
    cy.server();
    cy.route({
      url: '/contacts/find?username=testuser',
      response: {
        contacts: [
          { username: 'dragos', email: 'dragos@gmail.com' },
          { username: 'bred', email: 'bred@gmail.com' },
        ],
      },
    });
    cy.window()
      .its('localStorage')
      .invoke(
        'setItem',
        'contacts-testuser',
        JSON.stringify({
          contacts: [
            { username: 'user1', email: 'user1@gmail.com' },
            { username: 'bred', email: 'bred@gmail.com' },
          ],
        })
      );
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=contacts]').click();
    cy.get('[data-testid=contact-list]').children().should('have.length', 2);
  });
  it('user has remove contacts', () => {
    cy.server();
    cy.route({
      url: '/contacts/find?username=testuser',
      response: {
        contacts: [
          { username: 'dragos', email: 'dragos@gmail.com' },
          { username: 'bred', email: 'bred@gmail.com' },
        ],
      },
    });
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=contacts]').click();
    cy.get('[data-testid=contact-list]').children().should('have.length', 2);
  });
  it('user has no contacts at all', () => {
    cy.server();
    cy.route({
      url: '/contacts/find?username=testuser',
      response: {
        contacts: [],
      },
    }).as('enptylist');
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=contacts]').click();
    cy.get('[data-testid=contacts-list]').children().should('have.length', 0);
  });
  it('user searches for local contacts', () => {
    cy.window()
      .its('localStorage')
      .invoke(
        'setItem',
        'contacts-testuser',
        JSON.stringify({
          contacts: [
            { username: 'user1', email: 'user1@gmail.com' },
            { username: 'bred', email: 'bred@gmail.com' },
            { username: 'dragos', email: 'dragos@gmail.com' },
          ],
        })
      );
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=contacts]').click();
    cy.get('[data-testid=contact-search]').type('bred');
    cy.get('[data-testid=contacts-list]').children().should('have.length', 1);
  });
  it.only('user searches for new user', () => {
    cy.server();
    cy.route({
      url: '/users/find?filter=bred',
      response: { users: [{ username: 'bred', email: 'bred@gmail.com' }] },
    });
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=contacts]').click();
    cy.get('[data-testid=contact-search]').type('bred');
    cy.get('[data-testid=contacts-list]').children().should('have.length', 1);
  });
});
