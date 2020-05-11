describe('p2p_invitation_mobile', () => {
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
  });
  it('sending invitation', () => {
    cy.server();
    cy.route({
      url: '/users/find?filter=bred',
      response: { users: [{ username: 'bred', email: 'bred@gmail.com' }] },
    });
    cy.server();
    cy.route({
      url: '/p2p/invitation',
      method: 'post',
      response: { invation: {} },
    }).as('invitation');
    cy.visit('/');
    cy.wait(50);
    cy.get('[data-testid=menu]').click();
    cy.get('[data-testid=p2p]').click();
    cy.get('[data-testid=contact-search]').type('bred');
    cy.get('[data-testid=contacts-list]')
      .children()
      .should('have.length', 1)
      .click();
    cy.get('[data-testid=send-invitation-btn]').click();
    cy.wait('@invitation').then((xhr) => {
      debugger;
    });
  });
});
