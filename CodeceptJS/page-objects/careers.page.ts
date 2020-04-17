const { I } = inject();

const CAREERS_PAGE_HEADER = 'Current Job Openings at Robinhood';
const FINEPRINT_FRAGMENT = 'Robinhood Financial LLC and Robinhood Crypto, LLC are wholly-owned subsidiaries of Robinhood Markets';

export class CareersPage {
  iframe = '#grnhse_iframe';
  header = locate('h1').withText(CAREERS_PAGE_HEADER);
  finePrint = `//footer//div[contains(.,'${FINEPRINT_FRAGMENT}')]`;
  locationPulldown = '#offices-select';
  offers = `//*[@class='opening' and not(contains(@style, 'display: none'))]`;

  getOfferByIndex = (index: number) => `(//*[@class='opening' and not(contains(@style, 'display: none'))])[${index}]/a`;

  chooseLocation(value: string) {
    I.selectOption(this.locationPulldown, value);
  }

  getJobOfferTitle(index: number) {
    return I.grabTextFrom(this.getOfferByIndex(index));
  }

  chooseJobOffer(index: number) {
    I.click(this.getOfferByIndex(index));
  }
}

const careersPage = new CareersPage();

module.exports = careersPage;
