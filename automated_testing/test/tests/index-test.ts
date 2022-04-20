import IndexPage from '../pageobjects/index-page';

describe('Testing index', () => {
    let activeCards;
    let pastCards;
    beforeEach(async () => {
        await IndexPage.open();
        activeCards = await IndexPage.allCardsForActiveContests;
        pastCards = await IndexPage.allCardsForPastContests;
    });
    const contestCardsChecker = {
        cardsDisplayedCheck: (cards) => cards.length > 0,
        headersDisplayedCheck: (cards, headers) => cards.length === headers.length,
        categoriesDisplayedCheck: (cards, categories) => cards.length === categories.length,
        countersDisplayedCheck: (cards, counters) => cards.length === counters.length,

    };

    xit('Expect logInButton to exist', async () => {
        const btn = await IndexPage.logInButton;
        await expect(btn).toExist();
        await expect(btn).toHaveText('LOGIN');
        await expect(btn).toHaveHrefContaining('/login');
    });

    xit('Expect registerButton to exist', async () => {
        const btn = await IndexPage.registerButton;
        await expect(btn).toExist();
        await expect(btn).toHaveText('REGISTER');
        await expect(btn).toHaveHrefContaining('/register');
    });

    xit('Expect navBar to have headerLogoLink with href', async () => {
        const a = await IndexPage.headerLogoLink;
        await expect(a).toHaveHrefContaining('/');
    });

    xit('Expect to have imgTag with alt', async () => {
        const img = await IndexPage.headingImage;
        await expect(img).toExist();
        await expect(img).toHaveAttr('alt', 'softuni logo');
    });

    xit('Expect footer to exist', async () => {
        const footer = await IndexPage.footer;
        await expect(footer).toExist();
    });

    xit('Expect contests link in navigation to exist and have the correct href', async () => {
        const contestsLink = await IndexPage.navContestsLink;
        await expect(contestsLink).toExist();
        await expect(contestsLink).toHaveHrefContaining('/contests/all');
    });

    xit('Expect submissions link in navigation to exist and have the correct href', async () => {
        const submissionsLink = await IndexPage.navSubmissionssLink;
        await expect(submissionsLink).toExist();
        await expect(submissionsLink).toHaveHrefContaining('/submissions');
    });

    xit('Expect "See contests" button in navigation to exist and have the correct href', async () => {
        const btn = await IndexPage.seeContestsButton;
        await expect(btn).toExist();
    //  await expect(btn).toHaveHrefContaining('.....'); once the page is ready we will add it
    });

    xit('Expect YouTub video to exist', async () => {
        const video = await IndexPage.youtubeVideo;
        await expect(video).toExist();
    });

    xit('Expect Youtube video to have src', async () => {
        const video = await IndexPage.youtubeVideo;
        await expect(video).toHaveAttr('src');
        const src = await video.getAttribute('src');
        await expect(src).not.toBeNull();
    });

    xit('Expect "See all" button in active contest section to be diplayed and redirect properly', async () => {
        const btn = await IndexPage.seeAllActiveContestsButton;
        await expect(btn).toExist();
        await expect(btn).toHaveHrefContaining('/contests'); // must be to active
        await expect(btn).toBeClickable();
    });

    xit('Expect "See all" button in active contest section to exist and redirect properly', async () => {
        const btn = await IndexPage.seeAllPastContestsButton;
        await expect(btn).toExist();
        await expect(btn).toHaveHrefContaining('/contests'); // must be to past
        await expect(btn).toBeClickable();
    });

    xit('Expect having at least one active contest card', async () => {
        const check = await contestCardsChecker.cardsDisplayedCheck(activeCards);
        await expect(check).toEqual(true);
    });

    xit('Expect having at least one past contest card', async () => {
        const check = await contestCardsChecker.cardsDisplayedCheck(pastCards);
        await expect(check).toEqual(true);
    });

    xit('Expect every active contest card to have header', async () => {
        const headers = await IndexPage.allActiveContestCardsHeaders;
        const check = await contestCardsChecker.headersDisplayedCheck(activeCards, headers);
        await expect(check).toEqual(true);
    });

    xit('Expect every past contest card to have header', async () => {
        const headers = await IndexPage.allCardsForPastContests;
        const check = await contestCardsChecker.headersDisplayedCheck(activeCards, headers);
        await expect(check).toEqual(true);
    });

    xit('Expect every active contest card to have category', async () => {
        const categories = await IndexPage.allActiveContestCardsCategories;
        const check = await contestCardsChecker.categoriesDisplayedCheck(activeCards, categories);
        await expect(check).toEqual(true);
    });

    xit('Expect every past contest card to have category', async () => {
        const categories = await IndexPage.allActiveContestCardsCategories;
        const check = await contestCardsChecker.categoriesDisplayedCheck(activeCards, categories);
        await expect(check).toEqual(true);
    });
});
