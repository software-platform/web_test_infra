const ABOUT_THE_COMPANY_FRAGMENT = 'About the company';

export const jobPage = {
  getHeader: () => cy.get('h1.app-title'),
  getAboutCompany: () => cy.get(`p:contains(${ABOUT_THE_COMPANY_FRAGMENT})`),
  fillInputWithLabel: (label: string, text: string) => cy.get(`label:contains(${label})`).click().type(text),
  submit: () => cy.get('#submit_app').click(),
  getErrorMessage: (text: string) => cy.get('.field-error-msg').contains(text),
};
