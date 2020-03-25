import { Page, Frame } from 'playwright';

import { PageObject } from './PageObject';

const FINEPRINT_FRAGMENT = 'Robinhood Financial LLC and Robinhood Crypto, LLC are wholly-owned subsidiaries of Robinhood Markets';
const HEADER_FRAGMENT = 'Current Job Openings at Robinhood';
const GREENHOUSE_IFRAME_SELECTOR = '#grnhse_iframe';
const LOCATIONS_PULLDOWN_SELECTOR = '#offices-select';

class Pulldown {
  constructor(private page: Page | Frame, private selector: string) {}

  clickOption = (value: string) => this.page.selectOption(this.selector, value);
}

export class CareersPage extends PageObject {
  greenhouseIFrame: Frame;

  constructor(page: Page) {
    super(page);
  }

  async grabIFrame() {
    const handle = await this.page.$(GREENHOUSE_IFRAME_SELECTOR);
    this.greenhouseIFrame = await handle.contentFrame();
  }

  getFinePrint = () => this.selectByText(FINEPRINT_FRAGMENT);

  getHeader = () => this.greenhouseIFrame.$(`//h1[contains(., '${HEADER_FRAGMENT}')]`);

  getLocationsPulldown = () => new Pulldown(this.greenhouseIFrame, LOCATIONS_PULLDOWN_SELECTOR);

  chooseLocation = (value: string) => this.getLocationsPulldown().clickOption(value);

  getOffers = async () => await this.greenhouseIFrame.$$(`//*[@class='opening' and not(contains(@style, 'display: none'))]`);

  getOffersWithText = async (text: string) => await this.greenhouseIFrame.$$(`//*[@class='opening' and contains(., '${text}') and not(contains(@style, 'display: none'))]`);

  getJobOfferTitle = async (index: number) => {
    const offer = (await this.getOffers())[0];
    return offer.$eval('a', el => el.textContent);
  };

  chooseJobOffer = async (index: number) => {
    const offer = (await this.getOffers())[0];
    const offerLink = await offer.$('a');
    const url = await this.greenhouseIFrame.evaluate(el => (el as Element).getAttribute('href'), offerLink);

    return this.page.goto(url, { waitUntil: 'networkidle0' });
  };
}
