/* eslint-disable import/prefer-default-export */

import { ContestParticipationType } from './constants';

interface IParticipateInContestTypeUrlParams {
    id: number;
    participationType: ContestParticipationType;
}

interface IProblemSubmissionDetailsUrlParams {
    submissionId: number;
    hashParam: string;
}

interface IContestResultsUrl {
    id: number;
    participationType: ContestParticipationType;
}

export type { IParticipateInContestTypeUrlParams, IProblemSubmissionDetailsUrlParams, IContestResultsUrl };

