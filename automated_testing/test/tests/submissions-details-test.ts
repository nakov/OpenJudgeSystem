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
        await SubmissionsDetailsPage.open();
    });

    // after(async () => {
    //     await AuthPage.performLogOut();
    // });

    it('Expect left navigation to be there', async () => {
        await browser.waitUntil(
            () => browser.execute(() => document.readyState === 'complete'),
            {
                timeout: 10000,
                timeoutMsg: 'Message on failure',
            },
        );
        const navigation = await SubmissionsDetailsPage.submissionsNavigation;
        await expect(navigation).toExist();
    });

    it('Expect left navigation to have at least 1 submission', async () => {
        const submissionsList = await SubmissionsDetailsPage.submissionsListItems;
        const result = checker.notEmpty(submissionsList);
        await expect(result).toBeTruthy();
    });

    it('Expect right navigation to have at least 1 test run', async () => {
        const testRunsList = await SubmissionsDetailsPage.submissionTestRuns;
        const result = checker.notEmpty(testRunsList);
        await expect(result).toBeTruthy();
    });

    // xit('Expect submission with 0/100 results to have all test runs showing wrong answer or error', async () => {
    //     await browser.url('/submissions/23665173/details');
    //     const testRunsHeadings = await SubmissionsDetailsPage.submissionTestRunsHeadings;
    //     const wrongTestRunHeadings = await SubmissionsDetailsPage.submissionWrongTestRunsHeadings;
    //     await expect(testRunsHeadings.length).toEqual(wrongTestRunHeadings.length);
    // });
});
