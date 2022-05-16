import waitForDisplayed from 'webdriverio/build/commands/element/waitForDisplayed';
import ContestPage from '../pageobjects/contest-page';
import AuthPage from '../pageobjects/auth-page';
import IndexPage from '../pageobjects/index-page';

describe('Testing contest', () => {
    const validUserCredentials = {
        username: 'testuser123',
        password: '123456',
    };

    const loginWithCredentials = async (credentials) => {
        const { username, password } = credentials;
        await AuthPage.performLogIn(username, password);
        return validUserCredentials;
    };

    const loginInWithValidCredentials = () => loginWithCredentials(validUserCredentials);

    const contestChecker = {
        leftSideNavigationCheck: (problems) => problems.length > 0,
        executionTypeCheck: (strategies) => strategies.length > 0,
    };

    before(async () => {
        await AuthPage.open();
        await loginInWithValidCredentials();
        await IndexPage.firstPracticeCardButtoPastContests.click();
    });
    /*     after(async () => {
        await AuthPage.performLogOut();
    }); */

    xit('Expect left navigation to contain at least one problem', async () => {
        const problems = await ContestPage.allContestListSideNavigation;
        const check = await contestChecker.leftSideNavigationCheck(problems);
        console.log('+++++++++++++++++++++++++++++++');
        console.log(problems[0]);
        console.log('+++++++++++++++++++++++++++++++');
        await expect(check).toBeTruthy();
    });

    it('Expect to have at least one active execution type', async () => {
        const strategies = await ContestPage.allContestListSideNavigation;
        const check = await contestChecker.executionTypeCheck(strategies);
        console.log('+++++++++++++++++++++++++++++++');
        console.log(strategies[0]);
        console.log('+++++++++++++++++++++++++++++++');
        await expect(check).toBeTruthy();
    });

    xit('Expect left navigation to have title', async () => {
        const title = await ContestPage.leftSideNavigationTitle;
        await expect(title).toBeDisplayed();
        await expect(title).toHaveText('Tasks');
    });
});
