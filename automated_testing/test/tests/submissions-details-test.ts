import AuthPage from '../pageobjects/auth-page';
import SubmissionsDetailsPage from '../pageobjects/submissions-details-page';

describe('Testing SubmissionsDetails Page', () => {
    const validUserCredentials = {
        username: 'testuser123',
        password: '123456',
    };

    const checker = {
        notEmpty: (itemsList) => itemsList.length > 0,
    };

    const loginWithCredentials = async (credentials) => {
        const { username, password } = credentials;
        await AuthPage.performLogIn(username, password);
        return validUserCredentials;
    };

    const loginInWithValidCredentials = () => loginWithCredentials(validUserCredentials);

    before(async () => {
        await AuthPage.open();
        await loginInWithValidCredentials();
       // await SubmissionsDetailsPage.open();
       await browser.url('submissions/23665173/details');
       await browser.setTimeout({ implicit: 5000 });
    });

    // after(async () => {
    //     await AuthPage.performLogOut();
    // });

    xit('Expect left navigation to have at least 1 submission', async () => {
        const submissionsList = await SubmissionsDetailsPage.leftNavigationSubmissionsList;
        console.log('*************************************');
        console.log(submissionsList.length);
        console.log('*************************************');
        await expect(result).toBeTruthy();
    });

    xit('Expect right navigation to have at least 1 test run', async () => {
        const testRunsList = await SubmissionsDetailsPage.submissionTestRuns;
        const result = checker.notEmpty(testRunsList);
        await expect(result).toBeTruthy();
    });

    it('Expect title', async () => {
        const title = await SubmissionsDetailsPage.leftSubmissionNavigationTitle;
        console.log('*************************************');
        console.log(title);
        console.log('*************************************');
        await expect(title).toExist();
        await expect(title).toHaveText('Submissions');
    });

    // it('Expect submission with 0/100 results to have all test runs showing wrong answer or error', async () => {
    //     await browser.url('/submissions/23665173/details');
    //     const testRunsHeadings = await SubmissionsDetailsPage.submissionTestRunsHeadings;
    //     const wrongTestRunHeadings = await SubmissionsDetailsPage.submissionWrongTestRunsHeadings;
    //     await expect(testRunsHeadings.length).toEqual(wrongTestRunHeadings.length);
    // });
});
