E2E Web Testing Framework Evaluation (WIP)
==========================================

This repository consists of a number of directories - one for each framework demo, and - eventually, at root level - several files documenting the findings.

Running the tests
-----------------

Each directory is a separate project with its own `package.json`. Each `package.json` should define a `test` script as well as `polly:build` and `polly:start`. Each may also define framework- or browser-specific scripts. They will be described here, in their respective frameworks' sections (WIP).

> NOTE: Since Playwright [does not support Yarn](https://github.com.cnpmjs.org/microsoft/playwright/pull/794/files), NPM is recommended.

To run the tests: 
- Setup (needs to be done once per framework)
   - [Download](https://nodejs.org/en/download/) and install Node/NPM if you haven't already
   - From within a framework's directory, run `npm install` - this will install the framework and other dependencies (if applicable)
   - Run `npm run polly:build` - this will prepare PollyJS' injectable bundle
- Spin up PollyJS server (needs to be done once per session)
   - Run `npm run polly:start` - this start PollyJS server on port 4000
- Run `npm run test` - this will run the actual tests using the default browser

> TODO: Move PollyJS server out of the directories and into its own - it's confusing and we don't need multiple instances of it. Configure each framework test to use unique directory for the recordings.    


Test scenarios
--------------

**1. Job application - testing typical usage**
This should serve as an example of common E2E tasks, such as finding DOM elements, clicking links, dealing with iframes etc.

**Scenario:** Job application - navigating to "careers" page, finding a job post and submitting (some) data.

**Steps:**
- navigate to http://robinhood.com
- find and click a link labelled "careers"
- find the legalese fine print in the footer
- pick an item from the "locations" dropdown
- verify if the list options are limited to chosen location
- pick one of the offers
- find the "About the role" paragraph
- submit the form (invalid data which doesn't pass prevalidation, because we're working on production infrastructure and we don't want to litter it with test data)
- find the feedback


**2. Newsletter subscription - testing PollyJS integration**
This test requires a running PollyJS server. The expectation is for all the test runs except the first to *not* produce an asynchronous request to the real API. All subsequent tests should use data recorded during the first run.  
To avoid polluting the email database, the email address used for this test points to a single, public, receive-only mailbox at mailinator.com. To unsubscribe - go [here](https://www.mailinator.com/v3/index.jsp?zone=public&query=rh.test.user#/#inboxpane). 

**Scenario:** Subscribing to Robinhood Snacks

**Steps:**
- navigate to http://robinhood.com
- accept cookie policy (because the popup sometimes covers the newsletter UI, which - incidentally - should cause a _real_ E2E test to fail)
- fill in the email field (valid data)
- submit
- read confirmation
