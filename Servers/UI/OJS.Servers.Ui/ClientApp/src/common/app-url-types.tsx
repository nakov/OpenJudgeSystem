/* eslint-disable import/prefer-default-export */

import { ContestParticipationType } from './constants';

interface IContestDetailsUrlParams {
    id: number;
    participationType: ContestParticipationType;
}

interface IParticipateInContestTypeUrlParams {
    id: number;
    participationType: ContestParticipationType;
}

interface IProblemSubmissionDetailsUrlParams {
    submissionId: number;
    hashParam: string;
}

interface IContestResultsUrl {
    id: number | undefined;
    participationType: ContestParticipationType;
}

export type { IParticipateInContestTypeUrlParams, IProblemSubmissionDetailsUrlParams, IContestResultsUrl, IContestDetailsUrlParams };
