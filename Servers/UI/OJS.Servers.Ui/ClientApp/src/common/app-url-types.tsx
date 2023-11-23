import { ContestParticipationType } from './constants';

interface IParticipateInContestTypeUrlParams {
    id: number;
    participationType: ContestParticipationType;
}

interface ISubmissionDetailsUrlParams {
    submissionId: number;
}

interface IProblemSubmissionDetailsUrlParams {
    submissionId: number;
}

interface IContestResultsUrl {
    id: number | undefined;
    participationType: ContestParticipationType;
}

export type {
    IParticipateInContestTypeUrlParams,
    ISubmissionDetailsUrlParams,
    IProblemSubmissionDetailsUrlParams,
    IContestResultsUrl,
};
