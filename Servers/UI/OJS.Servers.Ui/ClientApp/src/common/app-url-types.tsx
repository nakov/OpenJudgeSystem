/* eslint-disable import/prefer-default-export */

import { ContestParticipationType } from './constants';

interface IParticipateInContestTypeUrlParams {
    id: number;
    participationType: ContestParticipationType;
    problemIndex: number;
}

interface IContestProblemUrl {
    id: number;
    participationType: ContestParticipationType;
    orderBy: number;
}

export type { IParticipateInContestTypeUrlParams, IContestProblemUrl };
