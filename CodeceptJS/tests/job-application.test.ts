import * as assert from 'assert';

import { Homepage } from 'page-objects/home.page';
import { CareersPage } from 'page-objects/careers.page';
import { JobDetailsPage } from 'page-objects/jobDetails.page';

Feature('job application');

Scenario('happy path', async (I, homepage: Homepage, careersPage: CareersPage, jobDetailsPage: JobDetailsPage) => {
  I.amOnPage('https://robinhood.com');
  homepage.clickCareersLink();

  I.seeElement(careersPage.finePrint);
  I.switchTo(careersPage.iframe);
  I.seeElement(careersPage.header);
  careersPage.chooseLocation('Denver, CO');

  const allOffers = await I.grabNumberOfVisibleElements(careersPage.offers);
  const correctOffers = await I.grabNumberOfVisibleElements(locate(careersPage.offers).withText('Denver, CO'));

  assert.equal(correctOffers, allOffers);

  const jobDescription = await careersPage.getJobOfferTitle(1);
  careersPage.chooseJobOffer(1);

  I.switchTo(jobDetailsPage.iframe);
  I.see(jobDescription as string, 'h1');
  I.see(jobDetailsPage.aboutCompany);
  jobDetailsPage.fillInputByLabel('First Name', 'Test');
  jobDetailsPage.fillInputByLabel('Last Name', 'User');
  jobDetailsPage.fillInputByLabel('Email', 'not.an.email');
  jobDetailsPage.submit();

  I.seeElement(jobDetailsPage.getErrorMessage('Please use the format "text@example.com"'));
});
