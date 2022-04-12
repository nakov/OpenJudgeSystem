import IndexPage from '../pageobjects/index-page';

describe('Testing index', () => {
    xit('Expect logInButton to exist', async () => {
        await IndexPage.open();
        const btn = await IndexPage.logInButton;
        await expect(btn).toExist();
        await expect(btn).toHaveText('LOGIN');
        await expect(btn).toHaveHrefContaining('/login');
    });

    xit('Expect registerButton to exist', async () => {
        await IndexPage.open();
        const btn = await IndexPage.registerButton;
        await expect(btn).toExist();
        await expect(btn).toHaveText('REGISTER');
        await expect(btn).toHaveHrefContaining('/register');
    });

    xit('Expect navBar to have headerLogoLink with href', async () => {
        await IndexPage.open();
        const a = await IndexPage.headerLogoLink;
        await expect(a).toHaveHrefContaining('/');
    });

    xit('Expect to have imgTag with alt', async () => {
        await IndexPage.open();
        const img = await IndexPage.headingImage;
        await expect(img).toExist();
        await expect(img).toHaveAttr('alt', 'softuni logo');
    });

    xit('Expect footer to exist', async () => {
        await IndexPage.open();
        const footer = await IndexPage.footer;
        await expect(footer).toExist();
    });

    xit('Expect contests link in navigation to exist and have the correct href', async () => {
        await IndexPage.open();
        const contestsLink = await IndexPage.navContestsLink;
        await expect(contestsLink).toExist();
        await expect(contestsLink).toHaveHrefContaining('/contests/all');
    });

    xit('Expect submissions link in navigation to exist and have the correct href', async () => {
        await IndexPage.open();
        const submissionsLink = await IndexPage.navSubmissionssLink;
        await expect(submissionsLink).toExist();
        await expect(submissionsLink).toHaveHrefContaining('/submissions');
    });

    xit('Expect "See contests" button in navigation to exist and have the correct href', async () => {
        await IndexPage.open();
        const btn = await IndexPage.seeContestsButton;
        await expect(btn).toExist();
    //  await expect(btn).toHaveHrefContaining('.....'); once the page is ready we will add it
    });

    xit('Expect YouTub video to exist', async () => {
        await IndexPage.open();
        const video = await IndexPage.youtubeVideo;
        await expect(video).toExist();
    });

    xit('Expect Youtube video to have src', async () => {
        await IndexPage.open();
        const video = await IndexPage.youtubeVideo;
        await expect(video).toHaveAttr('src');
        const src = await video.getAttribute('src');
        await expect(src).not.toBeNull();
    });

    xit('Expect activeContest card to have disabled "Practice" button ', async () => {
        await IndexPage.open();
        const btn = await IndexPage.practiceCardButton;

        await expect(btn).toExist();
        await expect(btn).not.toBeClickable();
    });

    xit('Expect activeContest card to have active "Compete" button ', async () => {
        await IndexPage.open();
        const btn = await IndexPage.competeCardButton;

        await expect(btn).toExist();
        await expect(btn).toBeClickable();
    });

    xit('Expect contest card to have displayed header', async () => {
        await IndexPage.open();
        const el = await IndexPage.contestCardHeader;

        await expect(el).toExist();
        await expect(el).toBeDisplayed;
    });

    xit('Expect contest card to have displayed course category', async () => {
        await IndexPage.open();
        const el = await IndexPage.contestCardCategory;

        await expect(el).toExist();
        await expect(el).toBeDisplayed;
    });

    xit('Expect activeContest card to have displayed message for NO practice time ', async () => {
        await IndexPage.open();
        const text = await IndexPage.contestCardTimeText;

        await expect(text).toExist();
        await expect(text).toBeDisplayed;
        await expect(text).toEqual('No practice end time.');
    });

    xit('Expect practice timer to be displayed in activeContest card ', async () => {
        await IndexPage.open();
        const text = await IndexPage.contestCardTimer;

        await expect(text).not.toExist();
        await expect(text).not.toBeDisplayed();
    });

    xit('Expect pastContest card to have displayed message for practice time ', async () => {
        await IndexPage.open();
        const text = await IndexPage.contestCardTimeText;

        await expect(text).toExist();
        await expect(text).toBeDisplayed();
        await expect(text).toEqual('Remaining time:');
    });

    xit('Expect pastContest card to have displayed timer ', async () => {
        await IndexPage.open();
        const text = await IndexPage.contestCardTimer;

        await expect(text).toExist();
        await expect(text).toBeDisplayed();
    });

    xit('Expect pastContest to have active "Practice" button ', async () => {
        await IndexPage.open();
        const btn = await IndexPage.practiceCardButton;

        await expect(btn).toExist();
        await expect(btn).toBeClickable();
    });

    xit('Expect activeContest card to have disabled "Compete" button ', async () => {
        await IndexPage.open();
        const btn = await IndexPage.competeCardButton;

        await expect(btn).toExist();
        await expect(btn).not.toBeClickable();
    });

    xit('Expect "See all" button in active contest section to be diplayed and redirect properly', async () => {
        await IndexPage.open();
        const btn = await IndexPage.seeAllActiveContestsButton;

        await expect(btn).toExist();
        await expect(btn).toHaveHrefContaining('/contests'); // must be to active
        await expect(btn).toBeClickable();
    });

    it('Expect "See all" button in active contest section to exist and redirect properly', async () => {
        await IndexPage.open();
        const btn = await IndexPage.seeAllPastContestsButton;

        await expect(btn).toExist();
        await expect(btn).toHaveHrefContaining('/contests'); // must be to past
        await expect(btn).toBeClickable();
    });
});
