import { ClientFunction, RequestLogger } from 'testcafe';

import { HomePage } from '../page-objects/HomePage';

const logger = RequestLogger({
  logResponseHeaders: true,
  logResponseBody:    true,
});

const stopPollyRecording = ClientFunction(() => window['polly'].stop());

fixture `Newsletter subscription`
  .page('http://robinhood.com')
  .clientScripts([
    {
      path: '../Polly/build/polly-injectable.js',
    },
    {
      content: `
        window.polly = new Polly('robinhood', {
          adapters: ['fetch', 'xhr'],
          persister: 'rest',
        });
        
        window.polly.configure({
          recordFailedRequests: true,
          persisterOptions: {
            keepUnusedRequests: true,
            rest: {
              host: 'http://localhost:4000'
            }
          },
        });
        
        const { server } = window.polly;
        
        server
          .get('/google-analytics/*path')
          .intercept((req, res) => res.sendStatus(200));
        `
    },
  ]);

test.requestHooks(logger)('Happy path', async t => {
  const homePage = new HomePage();

  await t.expect(homePage.$newsletterInput.exists).ok();

  // Cookie notification covers the input so we need to dismiss it.
  await homePage.acceptCookies();

  await homePage.subscribeToNewsletterAs('rh.test.user@mailinator.com');

  // TEST: Success message exists
  await t.expect(homePage.$subscriptionSuccessMessage.exists).ok();

  await stopPollyRecording();
});
