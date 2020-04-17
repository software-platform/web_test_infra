import { Page } from './Page';

const FINEPRINT_FRAGMENT = 'Robinhood Financial LLC and Robinhood Crypto, LLC are wholly-owned subsidiaries of Robinhood Markets';
const HEADER_FRAGMENT = 'Current Job Openings at Robinhood';
const GREENHOUSE_IFRAME_SELECTOR = '#grnhse_iframe';
const LOCATIONS_PULLDOWN_SELECTOR = '#offices-select';

class CareersPage extends Page {
  open() {
    super.open('https://careers.robinhood.com/openings');
  }

  get fineprint() {
    return $(`//div[contains(., '${FINEPRINT_FRAGMENT}')]`);
  }
}

class CareersPageIFrame extends Page {
  get header() {
    return $(`//h1[contains(., '${HEADER_FRAGMENT}')]`);
  }

  get offers() {
    return $$(`//*[@class='opening' and not(contains(@style, 'display: none'))]`);
  }

  getOffersWithText(text: string) {
    return $$(`//*[@class='opening' and contains(., '${text}') and not(contains(@style, 'display: none'))]`);
  }

  enter() {
    $(GREENHOUSE_IFRAME_SELECTOR).waitForExist();
    browser.switchToFrame($(GREENHOUSE_IFRAME_SELECTOR));
  }

  chooseLocationByLabel(label: string) {
    $(LOCATIONS_PULLDOWN_SELECTOR).selectByVisibleText(label);
  }

  getJobOfferLinkByIndex(index: number) {
    return this.offers[index].$('a');
  }
}

export const careersPage = new CareersPage();
export const careersPageIFrame = new CareersPageIFrame();
