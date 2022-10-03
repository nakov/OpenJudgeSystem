/* eslint-disable class-methods-use-this */

import selectors from '../constants/contest-page-selectors';

import Page from './page';

class ContestPage extends Page {
    private passwordProtectedContestLocation = {
        contestToEnroll: 'contests/3/register/compete',
        alreadyEnrolled: '/contests/3/compete',
    };

    public get allContestListSideNavigation() {
        return $$(selectors.pageSingleTaskFromSideNavigationSelector);
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
        return $$(selectors.pageExecutionTypeActiveSelector);
    }

    public get submitButton() {
        return $(selectors.pageSubmitButtonSelector);
    }

    public get tasksFromNavigationList() {
        return $$(selectors.pageSingleTaskFromSideNavigationSelector);
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

    public get submissionsResultsNoResultsParagraph() {
        return $(selectors.pageSubmissionResultsNoResultsParagraph);
    }

    public get contestNavigationResultsButton() {
        return $(selectors.pageLeftNavgationResultsBtn);
    }

    public get problemTabRequirements() {
        return $$(selectors.pageProblemTabRequirements);
    }

    public get contestPasswordField() {
        return $(selectors.pageContestPasswordField);
    }

    public get contestPasswordSubmitBtn() {
        return $(selectors.pageContestPasswordSubmitButton);
    }

    public get contestPasswordErrorMessage() {
        return $(selectors.pagerContestErrorMessage);
    }

    public openContest(): Promise<string> {
        return super.open(this.passwordProtectedContestLocation.contestToEnroll);
    }

    public openEnrolledContest(): Promise<string> {
        return super.open(this.passwordProtectedContestLocation.alreadyEnrolled);
    }

    public async enterPassword(input) {
        return (await this.contestPasswordField).setValue(input);
    }

    public async performeContstEnrollement(password) {
        await this.enterPassword(password);
        await (await this.contestPasswordSubmitBtn).click();
    }
}
export default new ContestPage();
