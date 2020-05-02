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

  it('fetch contacts', () => {
    cy.fixture('contacts').then((json) => {
      cy.route({ url: '/contacts/find', response: { contacts: json } });
      cy.get('[data-testid=menu]').click();
      cy.get('[data-testid=contacts]').click();
      cy.get('[data-testid=conversation]').click();
      cy.get('[data-testid=testuser]').click();
    });
  });
});
