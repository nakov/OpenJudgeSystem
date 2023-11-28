import { ISubmissionDetailsType } from '../hooks/submissions/types';

// Is processed, has tests and test runs are cleared, and has no errors
const isSubmissionEligibleForRetest =
    (submission: ISubmissionDetailsType) => submission?.testRuns.length === 0 &&
        submission.isCompiledSuccessfully &&
        submission.totalTests > 0 &&
        !submission.processingComment &&
        submission.isProcessed;

// User is lecturer or is the participant of the submission
const isRegularUserInRoleForSubmission =
    (
        submission: ISubmissionDetailsType,
        username: string,
    ) => submission?.testRuns.length === 0 &&
        (submission.userIsInRoleForContest || username === submission?.user.userName);

// eslint-disable-next-line import/prefer-default-export
export { isSubmissionEligibleForRetest, isRegularUserInRoleForSubmission };
