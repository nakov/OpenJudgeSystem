import { ISubmissionDetailsType } from '../hooks/submissions/types';

// User is lecturer or is the participant of the submission
const isRegularUserInRoleForSubmission =
    (
        submission: ISubmissionDetailsType,
        username: string,
    ) => submission.userIsInRoleForContest || username === submission?.user.userName;

// eslint-disable-next-line import/prefer-default-export
export { isRegularUserInRoleForSubmission };
