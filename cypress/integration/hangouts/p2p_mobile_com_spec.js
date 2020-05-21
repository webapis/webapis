describe('wsocket', () => {
  beforeEach(() => {
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
        debugger;
        const socket = new WebSocket(
          `ws://localhost:3000/chat/?username=remote`
        );
        socket.onmessage = (message) => {
          debugger;
          console.log('message from server', message);
       
        };
        socket.onclose = () => {
          debugger;

          console.log('i am closed');
        };

        socket.onopen = () => {
          debugger;

          console.log('i am closed');
          socket.send(JSON.stringify({ message: 'hello' }));
        };
        socket.onconnect = () => {
          debugger;
        };

        cy.wait(50);
        cy.get('[data-testid=menu]').click();
        cy.get('[data-testid=hangouts]').click();
        cy.get('[data-testid=contact-search]').type('remote');
        cy.get('[data-testid=contacts-list]')
          .children()
          .contains('remote')
          .click();
        cy.get('[data-testid=invite]');
      });
  });
});
