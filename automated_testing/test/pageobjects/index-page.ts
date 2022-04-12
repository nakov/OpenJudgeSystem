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

    private pageAllCardsSelector = '.Active-contests-cards-list';

    private pageContestCardHeaderAndCategorySelector = '#index-contests-list div div';

    private pageContestCardTimeTextSelector = '#index-contests-list p';

    private pageContestCardTimerSelector = '#index-contests-list p span';

    private pageContestCardButtonsSelector = '#index-contests-list a';

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

    public get allContestCards() {
        return $$(this.pageAllCardsSelector);
    }

    public get allActiveContestCards() {
        const activeCards = $$(this.pageAllCardsSelector);
        return activeCards[0];
    }

    public get allPastContestCards() {
        const pastCards = $$(this.pageAllCardsSelector);
        return pastCards[1];
    }

    public get contestCardHeader() {
        const cardHeader = $(this.pageContestCardHeaderAndCategorySelector);
        return cardHeader[0];
    }

    public get contestCardCategory() {
        const cardCategory = $$(this.pageContestCardHeaderAndCategorySelector);
        return cardCategory[1];
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
