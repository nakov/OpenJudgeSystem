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
        requirementsFiles: (files) => files.length > 0,
    };

    before(async () => {
        await AuthPage.open();
        await loginInWithValidCredentials();
    });

    after(async () => {
        await AuthPage.performLogOut();
    });

    describe('Testing compete contest', () => {
        before(async () => {
            await IndexPage.firstCompeteCardButtonActiveContests.click();
            await browser.setTimeout({ implicit: 5000 });
        });

        it('Expect left navigation to contain at least one problem', async () => {
            const problems = await ContestPage.allContestListSideNavigation;
            const check = await contestChecker.leftSideNavigationCheck(problems);
            await expect(check).toBeTruthy();
        });

        it('Expect every problem in the list to be accessible', async () => {
            const taskList = await ContestPage.allContestListSideNavigation;
            const check = await taskList.filter((b) => b.isClickable());
            await expect(check).toBeTruthy();
        });

        it('Expect full total score to be tasks score multiplied by 100', async () => {
            const problems = await ContestPage.allContestListSideNavigation;
            const totalScore = problems.length * 100;
            const score = await (await ContestPage.contestScore).getText();
            await expect(`0/${totalScore}`).toEqual(score);
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
            const files = await ContestPage.problemTabRequirements;
            const check = await contestChecker.requirementsFiles(files);
            await expect(check).toBeTruthy;
        });

        it('Expect to have active execution type', async () => {
            const strategies = await ContestPage.executionTypeAllActive;
            const check = await contestChecker.executionTypeCheck(strategies);
            await expect(check).toBeTruthy;
        });

        it('Expect to have only one active execution type', async () => {
            const activeStrategies = await ContestPage.executionTypeAllActive;
            const countStrategies = activeStrategies.length;
            await expect(countStrategies).toEqual(1);
        });

        it('Expect to have only one active execution type even if there are more choices', async () => {
            const activeStrategies = await ContestPage.executionTypeAllActive;
            const countActiveStrategies = activeStrategies.length;
            const inActiveStrategies = await ContestPage.executionTypeSelectorInactive;
            const countInActiveStrategies = inActiveStrategies.length;
            const total = countActiveStrategies + countInActiveStrategies;
            await expect(countInActiveStrategies).toEqual(total - 1);
        });

        it('Expect to have no results paragraph if nothing is submitted', async () => {
            await ContestPage.controlsSubmissionTab.click();
            const submissionsNoResultsParagraph = await ContestPage.submissionsResultsNoResultsParagraph;
            await expect(submissionsNoResultsParagraph).toExist() &&
        await expect(submissionsNoResultsParagraph.getText()).toEqual('No results for this problem yet.');
        });

        it('Expect Results button in left navigation to be enabled and clickable', async () => {
            const button = await ContestPage.contestNavigationResultsButton;
            const buttonHref = (await button.getAttribute('href')).toString();
            await expect(button).toBeClickable();
            await expect(button).toBeEnabled();
            await expect(buttonHref).toContain('results'); // it will be better to check with ID of the current contest
        });
    });

    describe('Testing practice contest', () => {
        before(async () => {
            await IndexPage.firstPracticeCardButtoPastContests.click();
            await browser.setTimeout({ implicit: 5000 });
        });

        it('Expect left navigation to contain at least one problem', async () => {
            const problems = await ContestPage.allContestListSideNavigation;
            const check = await contestChecker.leftSideNavigationCheck(problems);
            await expect(check).toBeTruthy();
        });

        it('Expect every problem in the list to be accessible', async () => {
            const taskList = await ContestPage.allContestListSideNavigation;
            const check = await taskList.filter((b) => b.isClickable());
            await expect(check).toBeTruthy();
        });

        it('Expect full total score to be tasks score multiplied by 100', async () => {
            const problems = await ContestPage.allContestListSideNavigation;
            const totalScore = problems.length * 100;
            const score = await (await ContestPage.contestScore).getText();
            await expect(`0/${totalScore}`).toEqual(score);
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
            const files = await ContestPage.problemTabRequirements;
            const check = await contestChecker.requirementsFiles(files);
            await expect(check).toBeTruthy;
        });

        it('Expect to have active execution type', async () => {
            const strategies = await ContestPage.executionTypeAllActive;
            const check = await contestChecker.executionTypeCheck(strategies);
            await expect(check).toBeTruthy;
        });

        it('Expect to have only one active execution type', async () => {
            const activeStrategies = await ContestPage.executionTypeAllActive;
            const countStrategies = activeStrategies.length;
            await expect(countStrategies).toEqual(1);
        });

        it('Expect to have no results paragraph if nothing is submitted', async () => {
            await ContestPage.controlsSubmissionTab.click();
            const submissionsNoResultsParagraph = await ContestPage.submissionsResultsNoResultsParagraph;
            await expect(submissionsNoResultsParagraph).toExist() &&
            await expect(submissionsNoResultsParagraph.getText()).toEqual('No results for this problem yet.');
        });

        it('Expect Results button in left navigation to be enabled and clickable', async () => {
            const button = await ContestPage.contestNavigationResultsButton;
            const buttonHref = (await button.getAttribute('href')).toString();
            await expect(button).toBeClickable();
            await expect(button).toBeEnabled();
            await expect(buttonHref).toContain('results'); // it will be better to check with ID of the current contest
        });
    });
});
