/* eslint-disable class-methods-use-this */
import selectors from '../constants/submissions-details-page-selectors';
import Page from './page';

class SubmissionsDetailsPage extends Page {
    // public get submissionsNavigationList() {
    //     return $(selectors.pageLeftNavigationSubmissionsListSelector);
    // }

    public get submissionsInSubmissionNavigation() {
        return $$(selectors.pageSubmissionsListItems);
    }

    // public get submissionTestRunsNavigation() {
    //     return $(selectors.pageRightNavigationSubmissionResultsSelector);
    // }

    public get submissionTestRuns() {
        return $$(selectors.pageTestRunsListItems);
    }

    public get submissionTestRunsHeadings() {
        return $$(selectors.pageTestRunsHeadingSelector);
    }

    // public get submissionWrongTestRunsHeadings() {
    //     return $$(selectors.pageWrongTestRunsHeadingSelector);
    // }
}
export default new SubmissionsDetailsPage();
