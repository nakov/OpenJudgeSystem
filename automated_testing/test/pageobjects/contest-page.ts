/* eslint-disable class-methods-use-this */
import { ChainablePromiseElement } from 'webdriverio';
import selectors from '../constants/contest-page-selectors';

import Page from './page';

class ContestPage extends Page {
    public get allContestListSideNavigation() {
        return $(selectors.pageAllContestListSideNavigationSelector);
    }

    public get singleContestSideNavigation() {
        return $(selectors.pageSingleContestSideNavigationSelector);
    }

    public get contestNavigation() {
        return $(selectors.pageContestNavigationSelector);
    }

    public get contestSubmissionBox() {
        return $(selectors.pageSubmissionBoxSelector);
    }

    public get contestControls() {
        return $(selectors.pageContestControlsSelector);
    }

    public get contestScore() {
        return $(selectors.pageContestScoreSelector);
    }

    public get contestRemainingTime() {
        return $(selectors.pageContestRemainingTimeSelector);
    }

    public get executionTypeSelectorActive() {
        return $(selectors.pageExecutionTypeSelectorActiveSelector);
    }

    public get executionTypeSelectorInactive() {
        return $(selectors.pageExecutionTypeSelectorInactiveSelector);
    }

    public get refreshSubmissionButton() {
        return $(selectors.pageRefreshSubmissionButtonSelector);
    }
}
export default new ContestPage();
