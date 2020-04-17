const FINEPRINT_FRAGMENT = 'Robinhood Financial LLC and Robinhood Crypto, LLC are wholly-owned subsidiaries of Robinhood Markets, Inc.';
const HEADER_FRAGMENT = 'Current Job Openings at Robinhood';

const getIframeBody = (selector: string) => cy.get(selector)
  .its('0.contentDocument.body', { log: false })
  .should('not.be.empty')
  .then(cy.wrap);

export const careersPage = {
  getTitle() {
    return cy.title();
  },
  getFinePrint() {
    return cy.get(`footer:contains(${FINEPRINT_FRAGMENT})`);
  },
  getHeader() {
    return getIframeBody('#grnhse_iframe').find(`h1:contains(${HEADER_FRAGMENT})`);
  },
  getLocationsPulldown() {
    return getIframeBody('#grnhse_iframe').find('#offices-select');
  },
  selectLocation(location: string) {
    return this.getLocationsPulldown().select(location);
  },
  getOpenings() {
    return getIframeBody('#grnhse_iframe').find('.opening:visible');
  }
};
