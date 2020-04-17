import {expect} from 'chai';

import { homepage } from 'page-objects/home.page';
import { careersPage, careersPageIFrame } from 'page-objects/careers.page';
import { jobDetailsPageIFrame } from 'page-objects/JobDetails.page';

describe('Job application', () => {
  it('Happy path', () => {
    homepage.open();

    homepage.careersLink.click();

    // TEST: Fine print exists
    careersPage.fineprint.waitForExist();

    careersPageIFrame.enter();

    // TEST: List header is immediately visible
    careersPageIFrame.header.waitForExist();

    careersPageIFrame.chooseLocationByLabel('Denver, CO');

    // TEST: Total number of offers matches the number of offers containing chosen location
    // NOTE: We wait for it, because filtering is done client-side and we must let the script do its job.
    browser.waitUntil(
      () => {
        const allOffersCount = careersPageIFrame.offers.length;
        const correctOffers = careersPageIFrame.getOffersWithText('Denver, CO').length ;

        return allOffersCount === correctOffers;
      },
      { interval: 300, timeout: 1500 },
    );

    const jobOfferLink = careersPageIFrame.getJobOfferLinkByIndex(1);
    const jobDescription = jobOfferLink.getText();

    jobOfferLink.click();

    // NOTE: The link has target: "_top", so the entire document gets replaced and the execution context goes with it.
    //       If we don't switch from stale context back to parent frame, devtools will throw.
    browser.switchToParentFrame();

    jobDetailsPageIFrame.enter();

    // TEST: Page title matches previously chosen job description
    expect(jobDetailsPageIFrame.header.getText()).to.equal(jobDescription);

    jobDetailsPageIFrame.fillInputByLabel('First Name', 'Test');
    jobDetailsPageIFrame.fillInputByLabel('Last Name', 'User');
    jobDetailsPageIFrame.fillInputByLabel('Email', 'not.actually.an.email');
    jobDetailsPageIFrame.submit();

    // TEST:
    jobDetailsPageIFrame.getErrorMessageByText('Please use the format "text@example.com"').waitForExist();
  })
});
