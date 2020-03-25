import { Selector, t } from 'testcafe';

import { Pulldown } from './Pulldown';

const FINEPRINT_FRAGMENT = 'Robinhood Financial LLC and Robinhood Crypto, LLC are wholly-owned subsidiaries of Robinhood Markets';
const HEADER_FRAGMENT = 'Current Job Openings at Robinhood';

export class CareersPage {
  $finePrint = Selector('footer *').withText(FINEPRINT_FRAGMENT);
  $header = Selector('h1').withText(HEADER_FRAGMENT);
  $jobListings = Selector('.opening').filterVisible();
  locationPulldown = new Pulldown('#offices-select');

  getLocationOptions() {
    return this.locationPulldown.getOptions();
  }

  chooseLocation(text) {
    return this.locationPulldown.clickOption(text);
  }

  getJobOffer(index: number) {
    return Selector('.opening').filterVisible().nth(index);
  }

  getJobOfferTitle(index: number) {
    return this.getJobOffer(index).find('a').innerText;
  }

  async chooseJobOffer(index: number) {
    const url = await this.getJobOffer(index).find('a').getAttribute('href');
    await t.switchToMainWindow();
    await t.navigateTo(url);
    await t.switchToIframe('#grnhse_iframe');
  }
}
