import { homePage } from './page-objects/homePage';
import { careersPage } from './page-objects/careersPage';

describe('Job application', function() {
  it('Job application (happy path)', function() {
    cy.visit('https://robinhood.com');

    homePage.acceptCookies();

    homePage.clickFooterOption('Careers');

    // TEST: Page title checks out
    careersPage.getTitle().should('equal', 'Robinhood - Careers');

    // TEST: Fine print exists
    careersPage.getFinePrint().should('exist');

    // TEST: List header exists
    careersPage.getHeader().should('exist');

    careersPage.selectLocation('Denver, CO');

    // TEST: There are job offers
    careersPage.getOpenings()
      .find('.location:contains(Denver, CO)')
      .should('have.length.of.at.least', 0);

    // TEST: There are only job offers at Denver, CO
    careersPage.getOpenings()
     .get('.location:not(:contains(Denver, CO))')
     .should('not.exist');
  });
});
