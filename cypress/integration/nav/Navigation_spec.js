import deviceType from '../../../client/layout/deviceType';
describe('Navigation', () => {
  it('Renders Top navigation bar', () => {
    cy.visit('/');
    cy.viewport('iphone-5');
  });
  it.only('Renders Top navigation bar', () => {
    cy.visit('/');
    cy.viewport(deviceType.phone, 800);
  });
});
