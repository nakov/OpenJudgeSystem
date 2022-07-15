/* eslint-disable class-methods-use-this */
import selectors from '../constants/submissions-details-page-selectors';
import Page from './page';

class SubmissionsDetailsPage extends Page {
    private pageLocation = 'submissions/23665175/details';

    public get submissionsNavigation() {
        return $(selectors.pageSubmissionsNavigationSelector);
    }

    public get submissionsListItems() {
        return $$(selectors.pageSubmissionsListItemsSelector);
    }

    public get submissionTestRunsNavigation() {
        return $(selectors.pageRightNavigationSubmissionResultsSelector);
    }

    public get submissionTestRuns() {
        return $$(selectors.pageTestRunsListItemsSelector);
    }

    public get submissionTestRunsHeadings() {
        return $$(selectors.pageTestRunsHeadingSelector);
    }

    public get leftSubmissionNavigationTitle() {
        return $(selectors.pageLeftSubmissionNavigationTitleSelector);
    }

    public get pageEditor() {
        return $(selectors.pageEditorSelector);
    }

    public open(): Promise<string> {
        return super.open(this.pageLocation);
    }
}
export default new SubmissionsDetailsPage();
