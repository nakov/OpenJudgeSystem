/* eslint-disable class-methods-use-this */
import { ChainablePromiseElement } from 'webdriverio';
import selectors from '../constants/index-page-selectors';

import Page from './page';

class IndexPage extends Page {
    private pageLocation = '';

    public get headerHeading() {
        return $(selectors.pageHeaderHeadingSelector);
    }

    public get navSubmissionssLink() {
        return $(selectors.pageNavSubmissionssLinkSelector);
    }

    public get navContestsLink() {
        return $(selectors.pageNavContestsLinkSelector);
    }

    public get youtubeVideo() {
        return $(selectors.pageYoutubeVideoSelector);
    }

    public get seeContestsButton() {
        return $(selectors.pageSeeContestsButtonSelector);
    }

    public get footer() {
        return $(selectors.pageFooterSelector);
    }

    public get headerLogoLink() {
        return $(selectors.pageHeaderLogoLinkSelector);
    }

    public get headingImage() {
        return $(selectors.pageHeadingImageSelector);
    }

    public get logInButton() {
        return $(selectors.pageLogInButtonSelector);
    }

    public get registerButton() {
        return $(selectors.pageRegisterButtonSelector);
    }

    public get activeContestCardsDiv() {
        return $(selectors.pageAllActiveCardsSelector);
    }

    public get pastContestCardsDiv() {
        return $(selectors.pageAllPastCardsSelector);
    }

    public get allCardsForActiveContests() {
        return $(selectors.pageAllActiveCardsSelector).$$(selectors.pageContestCardClassSelector);
    }

    public get allCardsForPastContests() {
        return $(selectors.pageAllPastCardsSelector).$$(selectors.pageContestCardClassSelector);
    }

    public get contestCardHeader() {
        return $$(selectors.pageContestCardDivSelectors)[0];
    }

    public get contestCardCategory() {
        return $$(selectors.pageContestCardDivSelectors)[1];
    }

    public get contestCardTimeText() {
        return $(selectors.pageContestCardTimeTextSelector);
    }

    public get contestCardTimer() {
        return $(selectors.pageContestCardTimerSelector);
    }

    public get competeCardButton() {
        return $(selectors.pageCardControlsSelector).$$('a')[0];
    }

    public get practiceCardButton() {
        return $(selectors.pageCardControlsSelector).$$('a')[1];
    }

    public get seeAllActiveContestsButton() {
        return $(selectors.pageSeeActiveContestsButtonSelector);
    }

    public get seeAllPastContestsButton() {
        return $(selectors.pageSeePastContestsButtonSelector);
    }

    public open(): Promise<string> {
        return super.open(this.pageLocation);
    }
}

export default new IndexPage();
