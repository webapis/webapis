describe('wsocket', () => {
  beforeEach(() => {
    cy.task('seed:hangouts', {});
    cy.viewport(700, 700);
    cy.login({
      username: 'demo',
      email: 'demo@gmail.com',
      password: 'Dragonfly1977!!!',
    });

    cy.remoteLogin({
      username: 'remote',
      email: 'remote@gmail.com',
      password: 'Dragonfly1977!!!',
    });

    cy.visit('/');
  });
  it('invite', () => {
    cy.window()
      .its('WebSocket')
      .then((WebSocket) => {
        const socket = new WebSocket(
          `ws://localhost:3000/hangouts/?username=remote`
        );
        socket.onmessage = (message) => {
          const expectedHangouts = {
            message: 'Lets caht',
            state: 'INVITER',
            username: 'demo',
          };
          const hangouts = JSON.parse(message.data);
          expect(hangouts).to.deep.equal(expectedHangouts);
          debugger;
          console.log('message from server', message);
        };
        socket.onclose = () => {
          console.log('i am closed');
        };

        socket.onopen = () => {
          console.log('i am closed');
          //socket.send(JSON.stringify({ message: 'hello' }));
        };
        socket.onconnect = () => {};

        cy.wait(50);
        cy.get('[data-testid=menu]').click();
        cy.get('[data-testid=hangouts]').click();
        cy.get('[data-testid=contact-search]').type('remote');
        cy.get('[data-testid=contacts-list]')
          .children()
          .contains('remote')
          .click();
        cy.get('[data-testid=invite]');
        cy.get('[data-testid=msgtextarea]').type('Lets caht');
        cy.get('[data-testid=inv-btn]').click();
      });
  });
});
