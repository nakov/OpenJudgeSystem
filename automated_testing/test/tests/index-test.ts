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
    // await expect(btn).toHaveHrefContaining('.....'); once the page is ready we will add it
    });

    it('Expect YouTub video to exist', async () => {
        await IndexPage.open();
        const btn = await IndexPage.youtubeVideo;
        await expect(btn).toExist();
    });
});
