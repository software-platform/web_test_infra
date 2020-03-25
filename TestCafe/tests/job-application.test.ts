import { RequestLogger } from 'testcafe';

import { HomePage } from '../page-objects/HomePage';
import { CareersPage } from '../page-objects/CareersPage';
import { JobDetailsPage } from '../page-objects/JobDetailsPage';

const logger = RequestLogger({
  logResponseHeaders: true,
  logResponseBody:    true,
});

fixture `Job application`
  .page('http://robinhood.com');

test.requestHooks(logger)('Happy path', async t => {
  const homePage = new HomePage();

  // TEST: "Careers" link exists
  await t.expect(homePage.$careersLink.exists).ok();

  await homePage.clickCareersLink();

  const careersPage = new CareersPage();

  // TEST: Fine print exists
  await t.expect(careersPage.$finePrint.exists).ok();

  await t.switchToIframe('#grnhse_iframe');

  // TEST: List header is immediately visible
  await t.expect(careersPage.$header.visible).ok();

  const locationOptions = await careersPage.getLocationOptions();
  const chosenLocation = locationOptions[1];

  await careersPage.chooseLocation(chosenLocation);

  const allJobsCount = await careersPage.$jobListings.count;
  const correctJobsCount = await careersPage.$jobListings.withText(chosenLocation.trim()).count;

  // TEST: Total number of offers matches the number of offers containing chosen location
  await t.expect(allJobsCount).eql(correctJobsCount);

  const offerTitle = await careersPage.getJobOfferTitle(0);

  await careersPage.chooseJobOffer(0);

  const jobDetailsPage = new JobDetailsPage();

  // TEST: Header matches the job description we've just clicked
  await t.expect(jobDetailsPage.$header.innerText).eql(offerTitle);

  // TEST: "About the company" paragraph exists
  await t.expect(jobDetailsPage.$aboutTheCompany.exists).ok();

  await jobDetailsPage.fillInputWithLabel('First Name', 'Test');
  await jobDetailsPage.fillInputWithLabel('Last Name', 'User');
  await jobDetailsPage.fillInputWithLabel('Email', 'not.actually.an.email');

  await jobDetailsPage.submit();

  // TEST: Error message appears
  await t.expect(jobDetailsPage.getErrorMessage('Please use the format "text@example.com"').exists).ok();
  await t.expect(logger.contains(record => record.request.url === 'https://boards-cdn.greenhouse.io/assets/svg/error-35c550072911634142c2e1d9f355979693558ca180c68334bdb0a333793e7abf.svg')).ok();
});
