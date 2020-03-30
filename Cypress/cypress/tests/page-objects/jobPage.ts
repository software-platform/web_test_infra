const ABOUT_THE_COMPANY_FRAGMENT = 'Robinhood is democratizing our financial system. With customers at the heart of our decisions, Robinhood is lowering barriers, removing fees, and providing greater access to financial information.';

export const jobPage = {
  getHeader: () => cy.get('h1.app-title'),
  getAboutCompany: () => cy.get(`p:contains(${ABOUT_THE_COMPANY_FRAGMENT})`),
  fillInputWithLabel: (label: string, text: string) => cy.get(`label:contains(${label})`).click().type(text),
  submit: () => cy.get('#submit_app').click(),
  getErrorMessage: (text: string) => cy.get('.field-error-msg').contains(text),
};
