import { Polly } from '@pollyjs/core';
import FetchAdapter from '@pollyjs/adapter-fetch';
import XHRAdapter from '@pollyjs/adapter-xhr';
import RESTPersister from '@pollyjs/persister-rest';

import { homePage } from './page-objects/homePage';

Polly.register(FetchAdapter);
Polly.register(XHRAdapter);
Polly.register(RESTPersister);

describe('Newsletter subscription', () => {
  it('Job application (happy path)', () => {
    cy.visit(
      'https://robinhood.com',
      {
        onBeforeLoad: (window) => {
          (window as any).polly = new Polly('robinhood', {
            adapters: ['fetch', 'xhr'],
            adapterOptions: {
              fetch: { context: window },
              xhr: { context: window },
            },
            persister: 'rest',
          });

          ((window as any).polly as Polly).configure({
            recordFailedRequests: true,
            persisterOptions: {
              keepUnusedRequests: true,
              rest: {
                host: 'http://localhost:4000'
              }
            },
          });
        }
      },
    );
    cy.wait(1000);

    homePage.acceptCookies();

    homePage.subscribeToNewsletterAs('rh.test.user@mailinator.com');

    // TEST: Success message appears
    homePage.getSubscriptionSuccessMessage().should('exist');

    // @ts-ignore
    cy.window().then(window => (window['polly'] as Polly).stop());
  });
});
