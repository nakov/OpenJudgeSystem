/* eslint-disable class-methods-use-this */

import selectors from '../constants/contest-page-selectors';

import Page from './page';

class ContestPage extends Page {
    public get allContestListSideNavigation() {
        return $$(selectors.pageAllContestListSideNavigationSelector);
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
        return $$(selectors.pageExecutionTypeSelectorActiveSelector);
    }

    public get executionTypeSelectorInactive() {
        return $$(selectors.pageExecutionTypeSelectorInactiveSelector);
    }

    public get refreshSubmissionButton() {
        return $(selectors.pageRefreshSubmissionButtonSelector);
    }

    public get leftSideNavigationTitle() {
        return $(selectors.pageSideNavigationTitleSelector);
    }

    public get executionTypeAllActive() {
        return $$(selectors.pageEexecutionTypeActiveSelector);
    }

    public get submitButton() {
        return $(selectors.pageSubmitButtonSelector);
    }

    public get divTest() {
        return $(selectors.pageSubmissionLabelProcessing);
    }

    public get submissionTest() {
        return $(selectors.pageSubmissionTab);
    }

    public get submissionResultConteiner() {
        return $(selectors.pageSubmissionResultConteiner).$(selectors.pageSubmissionLabelProcessing);
    }
}
export default new ContestPage();
