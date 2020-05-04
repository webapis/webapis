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

  // it('fetch users', () => {
  //   cy.fixture('users').then((json) => {
  //     cy.route({ url: '/users/find', response: { users: json } });
  //     cy.get('[data-testid=menu]').click();
  //     cy.get('[data-testid=contacts]').click();
  //     cy.get('[data-testid=conversation]').click();
  //     cy.get('[data-testid=testuser]').click();
  //   });
  // });

  it('user has logged in  for the first time', () => {
    cy.server();
    cy.route({ url: '/contacts/find', response: { return: [] } });
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=contacts]').click();
    cy.get('[data-testid=conversation]').click();
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

  it.only('user searches for new contacts and send invitation', () => {
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
      response: { users: [{ username: 'dragos', id: '4' }] },
    }).as('users');
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=contacts]').click();
    cy.get('[data-testid=conversation]').click();
    cy.get('[data-testid=usersincontact]').children().should('have.length', 3);
    cy.get('[data-testid=contactsearch]').type('drag');
    cy.get('[data-testid=usersincontact]').children().should('have.length', 0);
    cy.get('[data-testid=users]')
      .children()
      .should('have.length', 1)
      .contains('dragos');

      
  });
 
  it('user initiates chat')
  it('user initiater invitation to new user')
});
