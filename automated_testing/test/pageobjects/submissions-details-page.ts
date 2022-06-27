/* eslint-disable class-methods-use-this */
import selectors from '../constants/submissions-details-page-selectors';
import Page from './page';

class SubmissionsDetailsPage extends Page {
    private pageLocation = 'submissions/23665173/details';
    // public get submissionsNavigationList() {
    //     return $(selectors.pageLeftNavigationSubmissionsListSelector);
    // }

    public get submissionsNavigation() {
        return $(selectors.pageSubmissionsNavigation);
    }

    // public get leftNavigationSubmissionsList() {
    //     return $$(selectors.pageLeftNavigationSubmissionsListSelector);
    // }

    // public get submissionTestRunsNavigation() {
    //     return $(selectors.pageRightNavigationSubmissionResultsSelector);
    // }

    // public get submissionTestRuns() {
    //     return $$(selectors.pageTestRunsListItems);
    // }
    //
    // public get submissionTestRunsHeadings() {
    //     return $$(selectors.pageTestRunsHeadingSelector);
    // }

    // public get submissionWrongTestRunsHeadings() {
    //     return $$(selectors.pageWrongTestRunsHeadingSelector);
    // }

    // public get leftSubmissionNavigationTitle() {
    //     return $(selectors.pageLeftSubmissionNavigationTitle);
    // }

    public open(): Promise<string> {
        return super.open(this.pageLocation);
    }
}
export default new SubmissionsDetailsPage();
