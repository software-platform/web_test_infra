const { I } = inject();

export class Homepage {
  newsletterEmailField = '.css-178uc7j-EntryForm';

  clickCareersLink() {
    I.click('Careers');
  }

  subscribeToNewsletterAs(email: string) {
    I.fillField(this.newsletterEmailField, email);
    I.click('Subscribe');
  }

  acceptCookies() {
    I.click('I accept');
  }
}

const homepage = new Homepage();

module.exports = homepage;
