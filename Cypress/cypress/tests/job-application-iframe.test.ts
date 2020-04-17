import { jobPage } from './page-objects/jobPage';

const GREENHOUSE_JOB_ID = '2137513';
const JOB_DESCRIPTION = 'Benchmarking Associate';

describe('Job application (inside iframe)', () => {
  it('Job application (inside iframe)', () => {
    cy.visit(`https://boards.greenhouse.io/embed/job_app?for=robinhood&token=${GREENHOUSE_JOB_ID}`);

    jobPage.getHeader().should('contain', JOB_DESCRIPTION);
    jobPage.getAboutCompany().should('exist');
    jobPage.fillInputWithLabel('First Name', 'Test');
    jobPage.fillInputWithLabel('Last Name', 'User');
    jobPage.fillInputWithLabel('Email', 'not.an.email');
    jobPage.submit();
    jobPage.getErrorMessage('Please use the format "text@example.com"').should('exist');
  });
});
