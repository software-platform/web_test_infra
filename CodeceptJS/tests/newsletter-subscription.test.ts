import { Homepage } from 'page-objects/home.page';

Feature('newsletter subscription');

Scenario('happy path', async (I, homepage: Homepage) => {
  I.amOnPage('https://robinhood.com');
  homepage.acceptCookies();
  homepage.subscribeToNewsletterAs('rh.test.user@mailinator.com');
  I.see('You are subscribed! Best decision you’ve ever made!', 'span');
});
