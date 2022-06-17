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

    public get submissionTest() {
        return $(selectors.pageSubmissionTab);
    }

    public get submissionResultConteiner() {
        return $(selectors.pageSubmissionResultConteiner).$(selectors.pageSubmissionLabelProcessing);
    }

    public get taskListButtons() {
        return $$(selectors.pageAllContestListTaskButtons);
    }

    public get currentChosenTaskTitle() {
        return $(selectors.pageCurrentChosenTaskTitle);
    }

    public get controlsProblemTab() {
        return $$(selectors.pageSubmissionTabs)[0];
    }

    public get controlsSubmissionTab() {
        return $$(selectors.pageSubmissionTabs)[1];
    }

    public get scorePointsPerSubmission() {
        return $(selectors.pageSubmissionResultInPoints);
    }

    public get strategyTypePerSubmission() {
        return $(selectors.pageStrategyTypePerSubmission);
    }

    public get submissionLabel() {
        return $(selectors.pageSubmissionLabel);
    }
}
export default new ContestPage();
