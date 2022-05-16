import { beforeEach } from 'mocha';
import IndexPage from '../pageobjects/index-page';

describe.skip('Testing index', () => {
    let activeCards;
    let pastCards;

    const contestCardsChecker = {
        cardsDisplayedCheck: (cards) => cards.length > 0,
        headersDisplayedCheck: (cards, headers) => cards.length === headers.length,
        categoriesDisplayedCheck: (cards, categories) => cards.length === categories.length,
        countersDisplayedCheck: (cards, counters) => cards.length === counters.length,
        competeButtonsActiveCarsCheck: (cards, buttons) => cards.length === buttons.length,
    };

    beforeEach(async () => {
        await IndexPage.open();
        activeCards = await IndexPage.allCardsForActiveContests;
        pastCards = await IndexPage.allCardsForPastContests;
    });

    it('Expect logInButton to exist', async () => {
        const btn = await IndexPage.logInButton;
        await expect(btn).toExist();
        await expect(btn).toHaveText('LOGIN');
        await expect(btn).toHaveHrefContaining('/login');
    });

    it('Expect registerButton to exist', async () => {
        const btn = await IndexPage.registerButton;
        await expect(btn).toExist();
        await expect(btn).toHaveText('REGISTER');
        await expect(btn).toHaveHrefContaining('/register');
    });

    it('Expect navBar to have headerLogoLink with href', async () => {
        const a = await IndexPage.headerLogoLink;
        await expect(a).toHaveHrefContaining('/');
    });

    it('Expect to have imgTag with alt', async () => {
        const img = await IndexPage.headingImage;
        await expect(img).toExist();
        await expect(img).toHaveAttr('alt', 'softuni logo');
    });

    it('Expect footer to exist', async () => {
        const footer = await IndexPage.footer;
        await expect(footer).toExist();
    });

    it('Expect contests link in navigation to exist and have the correct href', async () => {
        const contestsLink = await IndexPage.navContestsLink;
        await expect(contestsLink).toExist();
        await expect(contestsLink).toHaveHrefContaining('/contests');
    });

    it('Expect submissions link in navigation to exist and have the correct href', async () => {
        const submissionsLink = await IndexPage.navSubmissionssLink;
        await expect(submissionsLink).toExist();
        await expect(submissionsLink).toHaveHrefContaining('/submissions');
    });

    it('Expect "See contests" button in navigation to exist and have the correct href', async () => {
        const btn = await IndexPage.seeContestsButton;
        await expect(btn).toExist();
    //  await expect(btn).toHaveHrefContaining('.....'); once the page is ready we will add it
    });

    it('Expect YouTub video to exist', async () => {
        const video = await IndexPage.youtubeVideo;
        await expect(video).toExist();
    });

    it('Expect Youtube video to have src', async () => {
        const video = await IndexPage.youtubeVideo;
        await expect(video).toHaveAttr('src');
        const src = await video.getAttribute('src');
        await expect(src).not.toBeNull();
    });

    it('Expect "See all" button in active contest section to be diplayed and redirect properly', async () => {
        const btn = await IndexPage.seeAllActiveContestsButton;
        await expect(btn).toExist();
        await expect(btn).toHaveHrefContaining('/contests'); // must be to active
        await expect(btn).toBeClickable();
    });

    it('Expect "See all" button in active contest section to exist and redirect properly', async () => {
        const btn = await IndexPage.seeAllPastContestsButton;
        await expect(btn).toExist();
        await expect(btn).toHaveHrefContaining('/contests'); // must be to past
        await expect(btn).toBeClickable();
    });

    it('Expect having at least one active contest card', async () => {
        const check = await contestCardsChecker.cardsDisplayedCheck(activeCards);
        await expect(check).toBeTruthy();
    });

    it('Expect having at least one past contest card', async () => {
        const check = await contestCardsChecker.cardsDisplayedCheck(pastCards);
        await expect(check).toBeTruthy();
    });

    it('Expect every active contest card to have header', async () => {
        const headers = await IndexPage.allActiveContestCardsHeaders;
        const check = await contestCardsChecker.headersDisplayedCheck(activeCards, headers);
        await expect(check).toBeTruthy();
    });

    it('Expect every past contest card to have header', async () => {
        const headers = await IndexPage.allCardsForPastContests;
        const check = await contestCardsChecker.headersDisplayedCheck(pastCards, headers);
        await expect(check).toBeTruthy();
    });

    it('Expect every active contest card to have category', async () => {
        const categories = await IndexPage.allActiveContestCardsCategories;
        const check = await contestCardsChecker.categoriesDisplayedCheck(activeCards, categories);
        await expect(check).toBeTruthy();
    });

    it('Expect every past contest card to have category', async () => {
        const categories = await IndexPage.allActiveContestCardsCategories;
        const check = await contestCardsChecker.categoriesDisplayedCheck(activeCards, categories);
        await expect(check).toBeTruthy();
    });

    it('Expect every active contest card to have compete button', async () => {
        const competeButtons = await IndexPage.competeCardButtonActivecontests;
        const check = await contestCardsChecker.competeButtonsActiveCarsCheck(activeCards, competeButtons);
        await expect(check).toBeTruthy();
    });

    it('Expect every active contest card to have practice button', async () => {
        const practiceButtons = await IndexPage.practiceCardButtoActiveContests;
        const check = await contestCardsChecker.competeButtonsActiveCarsCheck(activeCards, practiceButtons);
        await expect(check).toBeTruthy();
    });

    it('Expect every past contest card to have compete button', async () => {
        const competeButtons = await IndexPage.competeCardButtonPastcontests;
        const check = await contestCardsChecker.competeButtonsActiveCarsCheck(pastCards, competeButtons);
        await expect(check).toBeTruthy();
    });

    it('Expect every past contest card to have practice button', async () => {
        const practiceButtons = await IndexPage.practiceCardButtoPastContests;
        const check = await contestCardsChecker.competeButtonsActiveCarsCheck(pastCards, practiceButtons);
        await expect(check).toBeTruthy();
    });

    it('Expect every active contest card to have enabled compete button', async () => {
        const competeButtons = await IndexPage.competeCardButtonActivecontests;
        const check = await competeButtons.forEach((b) => b.isEnabled());
        await expect(check).toBeTruthy();
    });

    it('Expect every active contest card to have disabled practice button', async () => {
        const competeButtons = await IndexPage.competeCardButtonActivecontests;
        const check = await competeButtons.forEach((b) => b.isEnabled());
        await expect(check).toBeFalsy();
    });

    it('Expect every past contest card to have disabled compete button', async () => {
        const practiceButtons = await IndexPage.competeCardButtonPastcontests;
        const check = await practiceButtons.forEach((b) => b.isEnabled());
        await expect(check).toBeFalsy();
    });

    it('Expect every past contest card to have enabled practice button', async () => {
        const practiceButtons = await IndexPage.practiceCardButtoPastContests;
        const check = await practiceButtons.forEach((b) => b.isEnabled());
        await expect(check).toBeTruthy();
    });
});
