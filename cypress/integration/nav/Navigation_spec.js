import deviceType from '../../../client/layout/deviceType';
describe('Navigation', () => {
  it('Renders Top navigation bar', () => {
    cy.visit('/');
    cy.viewport('iphone-5');
  });
  it('Renders Top navigation bar', () => {
    cy.visit('/');
  
  });

  describe('Drawer',()=>{
    it.only('test phone drawer width',()=>{
      cy.viewport(deviceType.phone, 800);
      cy.visit('/');
      cy.get('[data-testid=menu]').click();
      cy.get('.drawer-phone-width')
    })

    it('test tablet drawer width',()=>{
      cy.viewport(deviceType.tablet, 800);
      cy.visit('/');
      cy.get('[data-testid=menu]').click();
      cy.get('.drawer-tablet-width')
    })

    it('test laptop drawer width',()=>{
      cy.viewport(deviceType.laptop, 800);
      cy.visit('/');
      cy.get('[data-testid=menu]').click();
      cy.get('.drawer-laptop-width')
    })

    it('test desktop drawer width',()=>{
      cy.viewport(deviceType.desktop, 800);
      cy.visit('/');
      cy.get('[data-testid=menu]').click();
      cy.get('.drawer-desktop-width')
    })
  })

});
