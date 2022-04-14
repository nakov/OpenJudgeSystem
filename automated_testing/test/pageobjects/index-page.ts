import { ChainablePromiseElement } from 'webdriverio';

import Page from './page';

class IndexPage extends Page {
    private pageLocation = '';

    private pageHeaderHeadingSelector = '#page-header-h2';

    private pageFooterSelector = '#pageFooter';

    private pageHeaderLogoLinkSelector = '#page-header-h2 a';

    private pageHeadingImageSelector = '#page-header-h2 a img';

    private pageLogInButtonSelector = '#anonymous-login-link';

    private pageRegisterButtonSelector = '#anonymous-register-link';

    private pageNavContestsLinkSelector = '#nav-contests-link';

    private pageNavSubmissionssLinkSelector = '#nav-submissions-link';

    private pageSeeContestsButtonSelector = '#button-see-contests';

    private pageYoutubeVideoSelector = '#youtube-video';

    private pageSeeActiveContestsButtonSelector ='.btn-see-all-contests-Active';

    private pageSeePastContestsButtonSelector = '.btn-see-all-contests-Past';

    private pageCompeteCardButtonSelector = '#button-card-compete'; // it will be changed or removed

    private pagePracticeCardButtonSelector = '#button-card-practice'; // it will be changed or removed

    private pageAllActiveCardsSelector = '.Active-contests-cards-list';

    private pageAllPastCardsSelector = '.Past-contests-cards-list';

    private pageContestCardClassSelector = '.card-contests';

    private pageContestCardHeaderAndCategorySelector ='.card-contests div';

    private pageContestCardTimeTextSelector = '.card-contests p';

    private pageContestCardTimerSelector = '.card-contests p span';

    public get headerHeading() {
        return $(this.pageHeaderHeadingSelector);
    }

    public get navSubmissionssLink() {
        return $(this.pageNavSubmissionssLinkSelector);
    }

    public get navContestsLink() {
        return $(this.pageNavContestsLinkSelector);
    }

    public get youtubeVideo() {
        return $(this.pageYoutubeVideoSelector);
    }

    public get seeContestsButton() {
        return $(this.pageSeeContestsButtonSelector);
    }

    public get footer() {
        return $(this.pageFooterSelector);
    }

    public get headerLogoLink() {
        return $(this.pageHeaderLogoLinkSelector);
    }

    public get headingImage() {
        return $(this.pageHeadingImageSelector);
    }

    public get logInButton() {
        return $(this.pageLogInButtonSelector);
    }

    public get registerButton() {
        return $(this.pageRegisterButtonSelector);
    }

    public get activeContestCardsDiv() {
        return $(this.pageAllActiveCardsSelector);
    }

    public get pastContestCardsDiv() {
        return $(this.pageAllPastCardsSelector);
    }

    public get allCardsForActiveContests() {
        return $(this.pageAllActiveCardsSelector).$$(this.pageContestCardClassSelector);
    }

    public get allCardsForPastContests() {
        return $(this.pageAllPastCardsSelector).$$(this.pageContestCardClassSelector);
    }
    // make them work

    public get activeContestCardHeader() {
        const header = $(this.pageAllActiveCardsSelector).$$(this.pageContestCardHeaderAndCategorySelector)[0];
        return header;
    }

    public get activeContestCardCategory() {
        const category = $(this.pageAllActiveCardsSelector).$$(this.pageContestCardHeaderAndCategorySelector)[1];
        return category;
    }

    public get contestCardTimeText() {
        return $(this.pageContestCardTimeTextSelector);
    }

    public get contestCardTimer() {
        return $(this.pageContestCardTimerSelector);
    }

    public get competeCardButton() {
        return $(this.pageCompeteCardButtonSelector);
    }

    public get practiceCardButton() {
        return $(this.pagePracticeCardButtonSelector);
    }

    public get seeAllActiveContestsButton() {
        return $(this.pageSeeActiveContestsButtonSelector);
    }

    public get seeAllPastContestsButton() {
        return $(this.pageSeePastContestsButtonSelector);
    }

    public open(): Promise<string> {
        return super.open(this.pageLocation);
    }
}

export default new IndexPage();
