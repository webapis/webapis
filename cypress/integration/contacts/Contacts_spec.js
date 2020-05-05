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
    cy.server();

    cy.visit('/');
    cy.wait(50);
  });



  it('user has one contact in contact list (saved to local storage)', () => {
    cy.window()
      .its('localStorage')
      .invoke(
        'setItem',
        'contacts',
        JSON.stringify([{ username: 'bred', id: '2' }])
      );
    cy.server();
    cy.route({ url: '/contacts/find', response: { return: [] } });
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=contacts]').click();
    cy.get('[data-testid=conversation]').click();
    cy.get('[data-testid=usersincontact]')
      .children()
      .should('have.length', 1)
      .contains('bred');
  });
  it('user has searched for local contacts', () => {
    cy.window()
      .its('localStorage')
      .invoke(
        'setItem',
        'contacts',
        JSON.stringify([
          { username: 'bred', id: '2' },
          { username: 'leonardo', id: '1' },
          { username: 'tom', id: '3' },
        ])
      );

    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=contacts]').click();
    cy.get('[data-testid=conversation]').click();
    cy.get('[data-testid=usersincontact]').children().should('have.length', 3);

    cy.get('[data-testid=contactsearch]').type('br');
    cy.get('[data-testid=usersincontact]')
      .children()
      .should('have.length', 1)
      .contains('bred');
    //test that fetchContacts api is not invoked---------------------------------------------
  });

  it('user searches for new contacts and sends invitation', () => {
    cy.window()
      .its('localStorage')
      .invoke(
        'setItem',
        'contacts',
        JSON.stringify([
          { username: 'bred', id: '2' },
          { username: 'leonardo', id: '1' },
          { username: 'tom', id: '3' },
        ])
      );
    cy.server();
    cy.route({
      url: '/users/find?filter=*',
      response: {
        users: [
          { username: 'dragos', id: '4' },
          { username: 'brendon', id: '5' },
        ],
      },
    }).as('users');
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=contacts]').click();
    cy.get('[data-testid=conversation]').click();
    cy.get('[data-testid=usersincontact]').children().should('have.length', 3);
    cy.get('[data-testid=contactsearch]').type('drag');
    cy.get('[data-testid=usersincontact]').children().should('have.length', 0);
    cy.get('[data-testid=users]')
      .children()
      .should('have.length', 2)
      .contains('dragos')
      .click();

    cy.get('[data-testid=invitations]').children().should('have.length', 1);

    cy.get('[data-testid=contactsearch]').clear();
    cy.get('[data-testid=contactsearch]').type('brendon');
    cy.get('[data-testid=users]').children().contains('brendon').click();
  });

  it('user initiates chat', () => {
    cy.window()
      .its('localStorage')
      .invoke(
        'setItem',
        'contacts',
        JSON.stringify([
          { username: 'bred', id: '2' },
          { username: 'leonardo', id: '1' },
          { username: 'tom', id: '3' },
        ])
      );

    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=contacts]').click();
    cy.get('[data-testid=conversation]').click();
    cy.get('[data-testid=usersincontact]').children().should('have.length', 3);
    cy.get('[data-testid=contactsearch]').type('bred');
    cy.get('[data-testid=usersincontact]').children().should('have.length', 1);
    cy.get('[data-testid=usersincontact]').children().contains('bred').click();
    cy.get('[data-testid=contactsearch]').clear();
    cy.get('[data-testid=contactsearch]').type('tom');
    cy.get('[data-testid=usersincontact]').children().contains('tom').click();
    cy.get('[data-testid=rooms]').children().should('have.length', 2);
  });

});
