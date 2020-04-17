TestCafe
--------

TestCafe works by spinning up a reverse proxy between the tested site and a regular (or headless) browser. The proxy (available as a standalone package - [Hammerhead](https://github.com/DevExpress/testcafe-hammerhead)) rewrites URLs and injects automation/monitoring logic into the visited site. Due to this approach, TC has the best browser support of all tested frameworks. Surprisingly, it does not reduce the framework's ability to interact with native alerts, prompts or file upload inputs.  
The test code itself runs outside of the browser context - in Node. This allows one to leverage Node APIs, but makes it slightly harder to run scripts browser-side. To that effect, TC provides helpers for injecting scripts either globally or into specific pages or iframes.

**Installation / set-up**  
Like all tested frameworks, TestCafe can be installed via NPM (or Yarn) - `npm i testcafe`. There are no browser binaries in the package (as TC uses the browsers it finds on the host machine), so the installation will take up around 95MB. Running the tests is a simple matter of `npx testcafe [browser] [test directory]`, where `browser` is an alias, a path to the executable or a browser/os identifier for a cloud service (e.g. "browserstack:safari@12.1:OS X Mojave").

**Typescript support**
Framework's type definitions are included in the package. Tests written in Typescript work out-of-the-box. No config required, not even a `tsconfig.json`.

**Coffeescript support**
Inexplicably, yes. It was [merged](https://github.com/DevExpress/testcafe/pull/2651) in August 2018.

**Documentation**
The official docs are very well-structured, up-to-date (as far as I could tell) and feature a snappy fuzzy search with as-you-type preview. The examples and recipes are top notch.

**API**
TestCafe uses its own test runner with built-in assertion library. Apart from some weird nomenclature (unless I'm mistaken, the word "fixture" is used there to refer to a test suite), they're both entirely... unsurprising. The tests use a plain, Promise-based API, so most of the lines in your test code will start with `await`.  
Selectors in TestCafe are lazy (they don't evaluate as soon as they're instantiated) and chainable (Selector instances expose methods that return Selector instances). As a result, they read well and can be composed/ reused. The default selector engine is CSS, but can be extended by framework-specific plugins such as such as [testcafe-react-selectors](https://github.com/DevExpress/testcafe-react-selectors/blob/master/README.md).  
API methods and assertions that use selectors and cause them to be evaluated, retry automatically until they match, within a timeout. The timeout - in turn - is set globally, but can be overriden on a per-selector basis.  

Here is an example of actions, selectors and an assertion:
```typescript
$newsletterInput = Selector('footer form input[type="email"]');
$newsletterSubmitButton = Selector('footer form button[type="submit"]');
$subscriptionSuccessMessage = Selector('span', { timeout: 5000 }).withText('You are subscribed!');

await t.click(this.$newsletterInput);
await t.typeText(this.$newsletterInput, email);
await t.click(this.$newsletterSubmitButton);
await t.expect(homePage.$subscriptionSuccessMessage.exists).ok();
```

Lastly, iframes are handled via a pair of methods used to switch context between frames and main window: `switchToIframe(s: Selector)` and `switchToMainWindow()`. I had no problems with cross-domain frames nor with a potentially troublesome `target="_top"` link in Robinhood's "Careers" section.

**Dev experience**
The test runner's console output is similar to Jest's - it's color-coded and verbose enough to easily track failures down to a step (such as a timed-out selector or false assertion). There is a (3 years old) [proposition](https://github.com/DevExpress/testcafe/issues/1381) to introduce named sections to tests, which would make the output of more complex tests even better.  
In headful mode, TC adds a minimalistic overlay with current action's name and an oversized cursor. The latter seems like a gimmick, but it did help me debug a failing text field input - cookie policy popup would cover the part of the field where TC had decided to click.  
There is a `--live` mode where browser window is kept open and the test runner watches spec files for changes and re-runs tests when necessary. Most of the time, it worked well enough, but I did have to restart the whole thing, on occasion.  
Between verbose logging, visual cues in the browser, live mode and predictable, no-frills API - I'd say my experience was pretty great.  

**PollyJS interop**
TestCafe provides a method of injecting scripts (either files or string variables) into tested pages. It can be done for the entire test suite or per-page. This way a pre-built PollyJS client can be injected along with its config and rudimentary start/stop logic. Unfortunately, it involves installing a bundler (I went with Webpack) for a one-time process of packaging PollyJS client and its adapters.  
There are three caveats:
- The tests wired to use PollyJS will fail without a working PollyJS server (this _might_ be fixed by making the init script ping the server and decide whether to activate Polly or not, depending on the response).
- After recording network traffic, `polly.stop()` needs to be called in order for the persister to flush the request/response data to disk. Simply `^C`ing the server will make it shut down ungracefully, losing the data. This may not be true for persisters other than REST.
- Replayed requests will bypass TestCafe's request logger.

**Cloud service providers**
I tested the framework with the three major Selenium-Grid-powered PAASes: BrowserStack, Sauce Labs and LambdaTest, with no problems at all. There is a browser provider plugin for browserless.io, but it's unfinished and not actively developed - it's been 11 months since last commits. AFAIK, platforms offering devtools-powered headless browsers, such as 0browser.com or headlesstesting.com are not compatible with TestCafe.

**TL;DR**
Great browser support, nice API, sufficient selector engine, no problems with iframes or external scripts, can use major cloud providers. What's not to like?

|Quick stats        |                                                                                      |
|------------------:|--------------------------------------------------------------------------------------|
|GitHub             |used by 4593 repos; 7933 stars; 30 merged PRs and 49 closed issues in the last 30 days|
|Stack Overflow     |500 search hits, 918 active questions tagged "testcafe", 156 unanswered               |
|test runner        |custom                                                                                |
|assertion lib      |built-in, with automatic waiting/retrying                                             |
|API style          |promise-based                                                                         |
|automation approach|Reverse proxy rewrites URLs and injects automation logic into tested site; Tests run in Node|
|iframe support     |Yes, with workarounds for cross-domain frames                                         |
|PollyJS interop    |effortless, but replayed requests are not registered by TC's request logger           |
|browser support    |most modern browsers; officially tested against Google Chrome (Stable, Beta, Dev and Canary), Internet Explorer (11+), Microsoft Edge (legacy and Chromium-based), Firefox, Safari, Chrome mobile, Safari mobile|
|license            |MIT                                                                                   |

Playwright
----------

Playwright is the latest of automation drivers - a reboot of Puppeteer (itself one of the new-ish libraries) by the same team, with the same API and better browser coverage. It is the most active of all tested solutions, development-wise. Unlike TestCafe or Cypress or - to a lesser extent - WebdriverIO, it is only an automation driver, not a full-fledged framework. Interestingly, its cross-browser support is achieved by bundling the driver with three patched versions of popular engines - Chromium, Webkit and Firefox.  
Is it ready, though? According to their official docs - "it is ready for your feedback". According to [this handy tracker](https://aslushnikov.github.io/isplaywrightready/) - there still are several failing tests across all three browsers.

**Installation / set-up** 
Unsurprisingly, `npm i playwright` is enough to install the library along with the three pre-built browser binaries. It'll take around 800MB (~850 on disk, depending on your filesystem). At the time of writing (15 April 2020), using Yarn instead of NPM will cause the install procedure to fail more or less silently. It's a known issue.  
Then, one needs to install a test runner / assertion library. I chose Jest with `ts-jest`.

**Typescript support**
Type definitions are (mostly) included in the package. The version I tested - however - lacked `@types/debug` (and possibly `@types/node`), resulting in _"TS2688: Cannot find type definition file for 'debug'"_. Last time I checked, it was supposed to get fixed in the upcoming build.  
The support for actually **writing** tests in Typescript is up to the user. Unlike TestCafe, Playwright does not _run_ the tests, so - understandably - it doesn't transpile them either.

**Documentation**
The documentation is exactly what one would expect from a project that doesn't even have a proper website, yet - there is a directory called `/docs` with markdown files in it. The API reference is [a single,  hilariously long file](https://github.com/microsoft/playwright/blob/v0.13.0/docs/api.md). I would say the function is there, but the form is not. It's a work in progress.  
Note: in a pinch, Puppeteer docs (or StackOverflow threads) _may_ prove helpful - Playwright's API is very similar.

**API**
Playwright's API slightly lower level than TestCafe's (not to mention its surface area is smaller due to narrower scope of the library). It's still an easy to use, promise-based affair, but without quality-of-life features like automatic retrying of steps or waiting for selectors / page loads. It's not a huge deal - the former is a responsibility of a future testing framework that will inevitably grow around Playwright, and the latter can be achieved manually by `.waitForSelector` and `.waitForNavigation` methods. Interaction methods such as `page.click(selector)` do wait until matching element appears.   
Speaking of selectors - PW comes with three selector engines built-in: text (matching elements by text content), CSS and XPath. They can be used in combination within a single selector string, with ">>" serving as a separator. Contrived example:
```
css=button >> text="click me" >> xpath=//svg//circle
```
When the engine name is omitted, selectors starting with `"` are assumed to be text, starting with `//` to be XPath and the rest - CSS, like so:
```
button >> "click me" >> //svg//circle
```
In reality, I don't imagine using several selector engines within a single, handcoded string is going to be a common scenario. It may come in handy when someone decides to write a selector-building helper, though.

One notable feature of Playwright's API is the concept of browser contexts. Simply put, a browser context is an equivalent of an incognito window. As such it does not share nor persist its session data. It may seem like an obvious approach, but judging by the entusiasm for it in several articles describing Playwright, it's a welcome step up from Puppeteer's default context.

Iframe interactions are slightly more low-level than in TestCafe - there is no switchable context in which commands are executed. Instead, one has to grab a Handle of an iframe element (Handle is what selector promises resolve to), and then run a `.contentFrame()` method on it. This should return a Frame object. Frame is an interface which seems to be a subset of Page methods. Here is how one would click a button inside an iframe:
```ts
const frameHandle = await page.$('#some_iframe');
const frame = await frameHandle.contentFrame();
await frame.click('#some_button');
```
Alternatively, it's possible to access the page's frame tree and `.find` a specific frame, thusly:
```ts
const frame = page.frames().find(frame => frame.name() === 'Some Frame');
await frame.click('#some_button');
```
It's not optimal, but - again - I suspect a framework using Playwright under the hood will someday provide an abstraction layer for this. Spoiler alert: CodeceptJS already does it.

**Dev experience**
A choice between a framework and a library is one of productivity vs flexibility, to me. When it comes to development, I prefer the latter. When it comes to E2E tests, however - I'm not so sure. I don't think I have enough experience to see the negative sides of bigger, more opinionated frameworks, or to appreciate the fine-grained control of using automation library, directly. This is why I can't be certain I prefer a roll-your-own, Playwright/Jest combination to something like TestCafe. I'm less satisfied with the resulting code, that's for sure, but this might be due to worse documentation and generally steeper learning curve. I enjoyed testing Playwright, but not as much as I hoped I would.

**PollyJS interop**
Playwright exposes all the mechanisms needed to manually integrate PollyJS into the test suite. There is a way of injecting scripts into the page, and of evaluating code in the browser context. Using these, I was able to hook up PollyJS in pretty much the same way as in TestCafe. However, in order to do this, I had to install `@next` version of Playwright as one of the methods wasn't fully implemented in release version at the time.
Additionally, there is a [chance of an official adapter from PollyJS team](https://github.com/Netflix/pollyjs/issues/308), somewhere down the road.

**Cloud providers**
There are at least three vendors claiming to offer Playwright support - 0browser.com, headlesstesting.com, browserless.io. At the time of writing this, none of them wants to talk to the latest release version, so maybe their claims are overly optimistic. Going back several minor versions (to 0.9), I was able to get trivial tests to run, but the test had to be SIGTERM'd each time. If anyone wants to try this - the relevant config key, back at v0.9 was `browserWSEndpoint` (similar to Puppeteer). Later, it seems to have changed to `wsEndpoint`, but - like I mentioned - none of the services allowed me to run any tests with newer versions of Playwright. The connections would register in their dashboards, but the tests would fail immediately with cryptic, SSL-related errors. /shrug  
In any case, advertising support for a pre-release library that introduces breaking changes right and left, strikes me as a bold move. They should've, at least, mentioned which release of Playwright they meant, when they mentioned `npm i playwright` in their docs.  
NB: According to semver, prior to version 1.0.0, _minor_ version bumps may (and probably are) breaking changes, as pre-1.0.0 software is considered to be inherently unstable.  
Among other cloud vendors, Lambdatest are _tentatively_ interested in supporting Playwright - they'll come back to me once anything changes on that front, but - seeing as they're mostly a Selenium Grid provider, I wouldn't hold my breath.  
Saucelabs mentioned Playwright (and Puppeteer) as examples of newer frameworks they're interested in, in the context of extending their OSS reach ([source](https://saucelabs.com/news/sauce-labs-deepens-investment-in-oss-community-establishes-new-open-source-program-office))  
There is a [community effort](https://github.com/microsoft/playwright/issues/626) underway to get PW browser binaries compatible with AWS Lambda.

**TL;DR**
Playwright is bare-bones by design, unfinished but very rapidly growing (in both feature set and popularity). It has a good ol' promise-based API, a nice choice of built-in selector engines; it's fast, takes up almost 1GB of disk space; none of the cloud providers that mention it on their pages really support it, and its official docs can probably be displayed on an IBM 3279 terminal without any loss of aesthetics.

|Quick stats        |                                                                                      |
|------------------:|--------------------------------------------------------------------------------------|
|GitHub             |used by 296 repos; 11193 stars; 281 merged PRs, 66 closed issues in the last 30 days  |
|Stack Overflow     |51 search hits, 12 active questions tagged "playwright", 6 unanswered                 |
|test runner        |n/a                                                                                   |
|assertion lib      |n/a                                                                                   |
|API style          |promise-based                                                                         |
|automation approach|patched binaries of Chromium, Webkit and Firefox browsers; DevTools protocol          |
|iframe support     |no dedicated API                                                                      |
|PollyJS interop    |similar to TestCafe; official adapter will come in the future                         |
|browser support    |Chromium, Webkit and Firefox _engines_, as opposed to regular browsers                |
|license            |Apache 2.0                                                                            |

Cypress
-------

Cypress is the most popular among "new school" E2E tools. It also seems like the most complete package - a polar opposite of Playwright/Puppeteer. It is packaged as an Electron app, has its own dedicated PAAS and has spawned an [entire ecosystem of plugins](https://docs.cypress.io/plugins/).

**Installation / set-up** 
`npm i cypress` / `yarn add cypress` (and ~150MB of disk space) is all you need. There is also a direct download option, for people who do not have Node/NPM installed (yet) but would like to try out the app. It's worth noting that the package is just a wrapper around a binary. Then, `npx cypress open` will open the launcher app.

**Typescript support**
Type definitions are - again - included in the package. ~~To write tests in Typescript, one needs to `npm i typescript @cypress/webpack-preprocessor` and provide a `tsconfig.json`~~ Alright, two days ago, [v4.4.0](https://docs.cypress.io/guides/references/changelog.html#4-4-0) got released, adding out-of-the-box TS support without the need for an external transpiler. Moving on...

**Documentation**
Second to none. It has very good structure and layout, the same search widget as TestCafe docs, and a dedicated section for best practices (!), in addition to the usual - API reference, guides, recipes etc. Cypress aims to be a complete E2E solution - the docs reflect this. I mean - there is even a helpful section about [what Cypress won't be good at, ever and why](https://docs.cypress.io/guides/references/trade-offs.html#Permanent-trade-offs-1).

**API**
This is a weird one. Cypress uses a chaining API, which - at first glance - may seem synchronous, but really isn't:
```
cy
  .get('label')
  .contains('Name')
  .click();

cy.type('Henry Dorsett Case');
```
These are two chains of asynchronous actions. They're executed sequentially, despite the obvious lack of `await` or `.then()`, because Cypress queues them, behind the scenes. Within each chain, things are (and often return) Chainable. Chainables, despite acting _almost_ like Promises and exposing a `.then()` method, are most definitely [not Promises](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Not-Promises). Some of them (Commands, specifically) have built-in retryability. They're never executed out of order, they don't have a `.catch()` method and you can't `await` them.  
Cypress' selector engine is jQuery, but with auto-retrying added in. Whenever jQuery would return an empty collection, Cypress re-queries the DOM.  
Iframe support is disappointing. Despite being a complete framework, Cypress does not provide any dedicated API for interacting with iframes. There is a [request/proposal](https://github.com/cypress-io/cypress/issues/685) of a `switchToIframe` functionality, but it's 3 years old and closed to non-collaborators, now. Additionally, [the thread dealing with iframe support](https://github.com/cypress-io/cypress/issues/136) had started 4 years ago and is still active. For now, this is what one has to work with:
```ts
cy
  .get('#some_iframe')
  .its('0.contentDocument.body')
  .should('not.be.empty') // this will retry, waiting for the contents to load
  .then(cy.wrap) // wraps the resulting DOM element in a Chainable<JQuery>
  .get('#some_button')
  .click();
```
This can be parametrised and stuffed into a custom command (a user-defined custom method on the `cy` façade), along with its TS signature. In fact, there is a [plugin](https://gitlab.com/kgroat/cypress-iframe) to that effect, but I haven't tested it.
Naturally, cross-origin frames are nearly impossible to work with. For my tests, I just disabled web security in the browser, which is an option available exclusively in Chrome.

**Dev experience**
Despite the iframe woes and the unnervingly magical API, Cypress' developer experience is pretty great, mostly due to how easy it is to debug the tests using its test runner app's Command Log. The Command Log is a nicely color-coded, real-time list of commands and assertions. It is displayed next to the actual page view and together they provide the so-called "time-travel debugging" - clicking on a log entry will make the page view show the relevant snapshot. Sadly, iframe content does not show in the snapshots, because iframes in Cypress are the worst. Still, it is the most informative test output and way of debugging of all the frameworks, here.  
There is a watch mode (it's the default mode, in fact) but I found it very unreliable - half the time I had to close/reopen the browser because the app would just stop registering the changes. What's worse, on several occasions one of the app's processes stalled in such spectacular way that my OS desktop switching turned into a 2 frames per second slideshow, my 2016 MBP case - into a very loud panini maker and made Activity Monitor award it an impressive albeit unrealistic 730% CPU usage. On one occasion I was forced to cold restart my machine, ruining an almost full year's uptime. Thank you, Cypress.  
On the other hand, our QA specialist claims he never had any of these problems, so YMMV.

**PollyJS interop**
This one is interesting. Since the entire test code runs in the browser, there is no need for an additional build step. Where other frameworks need a separate JS bundle and a way of injecting and running it before the actual page code, Cypress spec files can just `import` PollyJS client and its adjacent logic.  
As an alternative to PollyJS, Cypress offers an easy way of [stubbing network requests](https://docs.cypress.io/guides/guides/network-requests.html#Stubbing). There are two downsides to it, however: the lack of recording capability (the response data needs to be provided manually and stored as fixture) and missing support for Fetch API.

**Cloud providers**
There is an official Cypress PAAS. As far as I managed to test it, it's easy to use, requires very little configuration and offers per-file parallelisation. After running a test suite, the dashboard even suggests the optimal number of machines and predicted run times. Additionally, Cypress API is being designed with future integration with Sauce Labs in mind, but the functionality is not available, yet ([source](https://docs.cypress.io/faq/questions/general-questions-faq.html#Sauce-Labs)).

**TL;DR**
Super popular, great docs, limited browser coverage, lots of plugins, amazing debugging experience (until it freezes), unwieldy iframe support, non-standard (but ultimately well-liked API) plus a desktop app that may turn your machine into a fire hazard.

|Quick stats        |                                                                                      |
|------------------:|--------------------------------------------------------------------------------------|
|GitHub             |used by 34997 repos; 19510 stars; 70 merged PRs, 203 closed issues in the last 30 days|
|Stack Overflow     |5139 search hits; 2166 question tagged "cypress", 1027 unanswered                     |
|test runner        |Mocha                                                                                 |
|assertion lib      |Chai                                                                                  |
|API style          |chaining, DSL-like, not compatible with async/await                                   |
|automation approach|proprietary, needs a dedicated driver for each browser                                |
|iframe support     |notoriously weak                                                                      |
|PollyJS interop    |great, due to test code running inside the browser                                    |
|browser support    |Chrome, Firefox                                                                       |
|license            |MIT                                                                                   |

WebdriverIO v6
--------------

In version 6, WebdriverIO has added Chrome DevTools as its _default_ automation protocol. Under the hood it uses Puppeteer, so the browser support is limited to Chromium and Firefox Nightly. WDIO team does not consider Playwright integration to be feasible at the moment, due to the latter's dependency on custom browser binaries ([source](https://webdriver.io/blog/2020/03/26/webdriverio-v6-released.html#devtools-automation-protocol-is-now-default)).

**Installation / set-up** 
`npm i @wdio/cli && npx wdio config -y` is the quickest way to get started. The first command installs the command-line app and the second - uses it to generate config and to bootstrap the rest of the installation. `-y` answers "yes" to all config questions, accepting default answers. Among those is a choice of running tests locally and using sync API.  
To run the tests, one invokes the CLI app with the path to a config file, like so `npx wdio wdio.conf.js`.  
Testing against Firefox (Nightly, since stable version does not speak devtools, yet) is a matter of adding an entry to the config's `capabilities` array. In my case:
```
{
  maxInstances: 5,
  browserName: 'firefox',
  'moz:firefoxOptions': {
    binary: '/Applications/Firefox Nightly.app/Contents/MacOS/firefox-bin',
    headless: false,
  }
},
```
Initially, the `binary` field would get ignored, but it was a [trivial fix](https://github.com/webdriverio/webdriverio/pull/5198) (I guess I'm an official contributor to the WebdriverIO project, now). In case the change is not live, yet - there is a `patch-wdio` NPM script in the repo. It should replace the offending file with a fixed version.  
Firefox support is still very much a WIP - one of the tests fails, probably because iframe switching is not implemented there, yet.

**Typescript support**
Type definitions are included in the package, but in order to write test code in TS, [some configuration](https://webdriver.io/docs/typescript.html#framework-setup) is required. 

**Documentation**
It's well-structured and nicely formatted, but at this moment (right after the release of v6) it's not 100% up-to-date. Still, I found it useful enough.

**API**
WDIO offers two flavours of API - sync and async (sync being the default). Sync API works by wrapping async commands in Node.js [fibers](https://github.com/laverdet/node-fibers). The difference between this approach and that of Cypress is that it's safe to treat WDIO commands as _truly_ synchronous. If I put `console.log`s between WDIO commands, they'll all run in sequence. I'm not sure how useful it really is in practice, but - for me - it's an easier mental model than Cypress', and it makes for more readable code than your basic Promise-based API.  
The selector engines are similar to what Playwright offers: text, css and xpath. There is also a built-in React selector helper which lets one use component `displayName`s (I ignored it because it seemed too close to implementation details - it might be better for integration tests). Selector syntax is only slightly different to Playwright's and here it's not possible to use several engines in one selector string. It is possible to chain selector calls, thusly:
```ts
  $('footer')         // CSS
  .$('//div//form')   // XPath
  .$('div*=details')  // partial text
  .$('button=Submit') // exact text
```
Note, that the `$` function runs the selector query instead of just instantiating a selector object. In fact, the above example will fire four queries, which might not be a great idea unless using several selector engines are really necessary. Otherwise, it's better to just run a single, longer query. It also means that getter methods are the best way of using WDIO selectors in an Object Pattern, like so:
```ts
class SomePage {
  get header() {
    return $('h1');
  }
}
```
Iframe support follows the WebDriver `switchToFrame(id) / switchToParentFrame()` style - far superior to whatever Cypress and Playwright have to offer.

**Dev experience**
Honestly, on the spectrum between Playwright and Cypress I expected something way closer to Playwright. I assumed WebdriverIO is just a Node.js WebDriver client. In reality, there is a test launcher loosely bundled with most amenities one needs to start E2E tests. `wdio config` lets one choose a test runner, a reporter and a set of integration services for 3rd party tools. It strikes a nice balance between roll-your-own-stack and an opinionated framework. I went with the default values: Mocha, spec and - I believe - chromedriver service that I didn't use. There is an option to run WDIO in `--watch` mode - I'm happy to say I haven't had any problems with it.  

**PollyJS interop**
Unfortunately, I haven't found a way to disable target browsers' Content Security Policy, which breaks the injected PollyJS client.

**Cloud providers**
I managed to run the test suite on BrowserStack, Sauce Labs and Lambdatest, which isn't surprising at all, given that they're all Selenium Grid providers and the framework has "webdriver" in its name - it just reverted to WD protocol. According to the docs, the only configuration needed is username/key - WDIO is supposed to recognize the provider by their format. In practice, Lambdatest also needed `hostName`, `path` and `port`.  
The docs also mention TestingBot and CrossBrowserTesting. There are also plug-in services for WDIO, that help manage test metadata and - in case of Lambdatest and BrowserStack - control the platforms' local tunnel configurations.

**TL;DR**
Unexpectedly framework-like (despite the name); good TS support; closest to synchronous API; nice selector syntax; handles iframes well; _seems_ very fast; works with cloud providers; **does not** support Safari (in DevTools mode).

|Quick stats        |                                                                                       |
|------------------:|---------------------------------------------------------------------------------------|
|GitHub             |used by 22052 repos; 5613 stars; 86 merged PRs and 74 closed issues in the last 30 days|
|Stack Overflow     |1247 search hits; 1001 active questions tagged 'webdriver-io'; 470 unanswered          |
|test runner        |Mocha, Jasmine or Cucumber                                                             |
|assertion lib      |WebdriverIO Expect - an extension of Jest's matchers                                   |
|API style          |sync (fiber-based) or async (promises)                                                 |
|automation approach|Chrome DevTools or Selenium WebDriver                                                  |
|iframe support     |WebDriver-style                                                                        |
|PollyJS interop    |failed miserably                                                                       |
|browser support    |Chromium, Firefox Nightly                                                              |
|license            |MIT                                                                                    |

CodeceptJS
----------

CodeceptJS (some relation to Codeception - a PHP testing framework) is a bit of an outlier. Rather than a standalone automation library or a testing framework, it's a common API layer over several of those: Appium, Puppeteer, TestCafe, WebdriverIO, Protractor, Nightmare and - lately - Playwright. Its browser support depends on the underlying toolkit.

**Installation / set-up** 
`npm i codeceptjs playwright@^0.12.1 && npx codeceptjs init` - the second command will fire up Codecept's interactive config.  
`npx codeceptjs gt` will ask for a name and generate a test template file.
`npx codeceptjs run --steps` will run every test in the directory specified during initialisation (`--steps` will make the output fairly verbose). That's it.

**Typescript support**
Not unlike other frameworks, CodeceptJS package includes its type definitions. When it comes to writing tests in TS - some assembly is required:
- `npm i ts-node typescript`
- in the `codecept.conf.js`:
  - `tests: './tests/*.test.ts'`,
  - `require: ['ts-node/register']`.

Then comes the awkward part - in CodeceptJS, page objects and custom helpers (which are pretty much the only reason for having TS in tests) get injected into test functions at runtime, IoC-style. There is a CLI command - `codeceptjs def`, which should generate missing definitions, but - at least in my setup - they don't seem to work at all. It might have be a simple matter of tweaking tsconfig.json and/or my IDE language server preferences, but I decided to take a shortcut and just imported the types into my test files and assigned them to variables manually.

**Documentation**
CodeceptJS' documentation is why I gave up on debugging the TS issue. Some aspects of the framework are frustratingly underdocumented, others have outdated entries. Here's a section entitled "Using Typescript", in its entirety:

> With Typescript, just simply replacing `module.exports` with `export` for autocompletion.

Helpful. I managed to get it (more or less) running by consulting StackOverflow and going through someone's GitHub repo. To sum up - CodeceptJS docs are not that great.

**API**
The API - CodeceptJS' raison d'être - is faux-sync and heavy on chaining, just like Cypress', but BDD-style:
```
I.amOnPage('https://robinhood.com');
I.fillField('name@email.com', 'rh.test.user@mailinator.com');
I.click('Subscribe');
I.see('You are subscribed! Best decision you’ve ever made!', 'span');
```
There are ways to add custom "steps" to do things like `I.dismissCookiePopup()`.  
CodeceptJS' locator system is quite robust: in addition to CSS selectors and XPath expressions, there are semantic locators, where the engine will try to guess the criteria - id, content, class, tag or name, depending on the context. So, `I.fillField('email', 'foo@bar.baz')` will make it look for a field named 'email' or a field with 'email' as a placeholder. It's clever but not much clever than the heuristics used by some other frameworks.  
When working with Playwright helper, iframes are handled through `I.switchTo(locator)` method. Omitting the argument makes the method switch back to parent frame.

**Dev experience**
The good: the output is as granular as the tests themselves; the specs read like natural language; the DSL is relatively easy to extend. Plus, there is a way of switching the test runner to "interactive mode" - it behaves like a REPL until the mode is switched off.
The bad: the availability of some commands depends on the driver; the docs are patchy; Typescript support is tacked on. Also - I simply don't trust this abstraction enough to pile it on top of some already unstable stack.

**PollyJS interop**
I tried and I failed. There is a PollyJS-based helper called [MockRequest](https://codecept.io/helpers/MockRequest/#mockrequest) which used to be built-in, but now is a separate package (although the documentation still does not reflect that fact). Sadly, it is supposed to work with Puppeteer and (partially) with WebDriver. There are GH issues suggesting it doesn't even do that. I decided not to pursue it further. The way I see it, if direct PollyJS integration with some framework is already problematic, then CodeceptJS won't make it easier. If it's easy - the best case scenario is that CodeceptJS won't cause any trouble.

**Cloud providers**
Compatibility with cross-browser service providers depends fully on the chosen library.

**TL;DR**
Nice idea (if you badly need BDD-like syntax), imperfect implementation. Dodgy docs, so-so TS support, very nice CLI, really readable test code, but at the price of increased stack complexity.

|Quick stats        |                                                                                      |
|------------------:|--------------------------------------------------------------------------------------|
|GitHub             |1240 dependent repos; 2747 stars; 31 merged PRs and 26 closed issues in the last month|
|Stack Overflow     |305 search hits; 139 active questions tagged 'codeceptjs', 64 unanswered              |
|test runner        |modified Mocha                                                                        |
|assertion lib      |extension of Jest's expect                                                            |
|API style          |BDD-like DSL; global promise queue                                                    |
|automation approach|n/a                                                                                   |
|iframe support     |in case of Playwright - WebDriver-style context switching                             |
|PollyJS interop    |not really                                                                            |
|browser support    |n/a                                                                                   |
|license            |MIT                                                                                   |

Cross-browser service providers
===============================

My brief overview of various PAAS suggests there are two categories thereof:

- Selenium Grid-based behemoths ([BrowserStack](https://browserstack.com), [Sauce Labs](https://saucelabs.com), [Lambdatest](https://www.lambdatest.com)), each offering over 1500 combinations of browser/OS on top of reporting tools, manual testing tools and every possible integration - from Travis CI to Slack. In regards to framework compatibility, there are no differences between them: they support any automation framework as long as it speaks WebDriver. There is some initiative to include non-WD tools, like Puppeteer or Playwright, but - since we're interested in Playwright, specifically, I wouldn't count on this support until PW gets more stable. I talked to people at Lambdatest and their opinion after checking out PW is that it will be possible to integrate it, but - preferably - once it reaches v1.0.0.  
Out of non-WebDriver frameworks, TestCafe is in a unique position, here, due to its working principles - it doesn't need a driver (or - for that matter - a special browser binary), as it talks through WSS to its own automation scripts running as plain JS on any relatively fresh browser. 

- Smaller outfits, offering Chrome/Edge/Firefox + Linux for use with Puppeteer and (eventually) Playwright: [0browser](https://0browser.com) (this one has a single pricing plan - free), [HeadlessTesting](https://headlesstesting.com/), [Browserless](https://browserless.io) (they also expose WebDriver API) or [SauceLabs' headless variant](https://saucelabs.com/platform/sauce-headless). Some of these platforms also offer analytics, reporting and 3rd party integrations. Sadly, none of them seems to keep up with Playwright's development, for now.

Interesting detail: regardless of the framework/PAAS combination, each test I managed to run with both cloud-based browser and PollyJS server, has resulted in automatic tunnelling back to my machine - the browsers would query my local PollyJS server without any additional configuration.

Final comparison
================

**Github pulse, StackOverflow activity**
|framework  |dependents|GH stars|PRs|closed GH issues|SO hits|SO questions (unanswered)|
|----------:|----------|--------|---|----------------|-------|-------------------------|
|TestCafe   |4593      |7933    |30 |49              |500    |918 / 156                |
|Cypress    |34997     |19510   |70 |203             |5139   |2155 / 1027              |
|Playwright |300       |11195   |302|81              |46     |11 / 7                   |
|WebdriverIO|22052     |5613    |86 |74              |1247   |1001 / 470               |
|CodeceptJS |1231      |2739    |27 |22              |303    |138 / 64                 |

In the "framework" category, Cypress is clearly more popular and - possibly - faster developing than TestCafe. Interestingly, it has twice the amount of questions on SO, but almost half of them are unanswered, compared to TestCafe's 17%. Playwright is growing very fast and has a lot of hype surrounding it, but - being an automation driver - it's in a category of its own. Plus, it is nowhere near ready (in terms of ecosystem size and API stability).

**Key metrics**

> Note: Score is on a scale from 0 (terrible) to 5 (great).  
**Typescript support:** quality of bundled type definitions and ease of configuration needed to write test files in TS  
**Stability:** how repeatable the test results are and how unlikely the toolkit is to crash  
**Perceived speed:** I don't think there are significant differences between automation strategies (devtools vs what Cypress/TestCafe do) or implementations of locator engines. This column's score means how fast the framework seems to initialise/restart tests. To really benchmark testing speed, one would have to repeat the test many times against locally served site.  
**PAAS:** the availability of platforms compatible with given framework
**API:** personal opinion about the API (very subjective); API style
**Developer experience:** in short - whether or not I find the framework pleasant to work with (again - subjective and colored by the fact I'm not really a QA guy)

|framework  |TS |browser support     |stability|perceived speed|PAAS|API                       |dev exp|
|-----------|---|--------------------|---------|---------------|----|--------------------------|-------|
|TestCafe   |5  |All of them         |4        |4              |5   |4; promise                |4      |
|Cypress    |5  |Chrome, FF (beta)   |1/4 *    |3              |? * |3 *; global queue         |4 *    |
|Playwright |4  |Chrome, FF, Webkit* |4        |4              |0 * |4; promise                |4      |
|WebdriverIO|4  |Chrome, FF (nightly)|5        |5              |4 * |5; sync / promise         |4      |
|CodeceptJS |3  |n/a                 |n/a      |4              |n/a |4; BBD-style, global queue|3      |

- Cypress' stability is split between app/runner (1) and headless (4).  
There is a single dedicated PAAS, but Cypress will - eventually - be supported by others.
Its API score is very subjective - while I don't like its approach, people with actual experience with E2E testing don't have anything against it.
Dev experience is a mixed bag - in theory, it has the best visualisation/debugging tool - the Command Log. In practice, the app is sluggish, occasionally unresponsive and sometimes seems to restart the test but with the old code, which is really, really confusing. Again - our QA specialist denies it ever happening to him.
- Playwright's browser coverage is really a _browser engine coverage_.
Its PAAS compatibility is a matter of time. Last time I checked - it wasn't there.
- WebdriverIO's cloud browser compatibility assumes it is running in WebDriver mode.
