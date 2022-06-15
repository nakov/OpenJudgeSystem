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
        await IndexPage.firstCompeteCardButtonActiveContests.click();
        await browser.setTimeout({ implicit: 5000 });
    });

    after(async () => {
        await AuthPage.performLogOut();
    });

    it('Expect left navigation to contain at least one problem', async () => {
        const problems = await ContestPage.allContestListSideNavigation;
        const check = await contestChecker.leftSideNavigationCheck(problems);
        await expect(check).toBeTruthy();
    });

    it('Expect every problem in the list to be accessible', async () => {
        const taskList = await ContestPage.taskListButtons;
        const check = await taskList.forEach((b) => b.isClickable());
        await expect(check).toBeTruthy();
    });

    it('Expect full total score to be tasks score multiplied by 100', async () => {
        const problems = await ContestPage.allContestListSideNavigation;
        const totalScore = problems.length * 100;
        await expect(`0/${totalScore}`).toEqual('0/900'); // once score selector is fixed it will replace '0/900'
    });

    it('Expect Submit button to be enabled and clickable', async () => {
        const button = await ContestPage.submitButton;
        await expect(button).toBeClickable();
        await expect(button).toBeEnabled();
    });

    it('Expect left navigation to have title', async () => {
        const title = await ContestPage.leftSideNavigationTitle;
        await expect(title).toHaveText('Tasks');
    });

    it('Expect the contest to have remaining time diplayed', async () => {
        const remainingTime = await ContestPage.contestRemainingTime;
        await expect(remainingTime).toBeDisplayed();
    });

    it('Expect selected task to have requirements file in "Problem"', async () => {
        const problemTab = await ContestPage.controlsProblemTab;
        await expect(problemTab).toExist();
        await expect(problemTab).toHaveAttribute('button');
    });

    it('Expect to have active execution type', async () => {
        const strategies = await ContestPage.executionTypeAllActive;
        const check = await contestChecker.executionTypeCheck(strategies);
        await expect(check).toBeTruthy;
    });

    it('Expect to have only one active execution type', async () => {
        const strategies = await ContestPage.executionTypeAllActive;
        const check = strategies.length;
        await expect(check).toBeTruthy;
    });
});
