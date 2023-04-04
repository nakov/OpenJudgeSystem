/* eslint-disable import/prefer-default-export */

import { ContestParticipationType } from './constants';

interface IRegisterForContestTypeUrlParams {
    id: number;
    participationType: ContestParticipationType;
}

interface IContestProblemUrl {
    id: number;
    participationType: ContestParticipationType;
    orderBy: number;
}

export type { IRegisterForContestTypeUrlParams, IContestProblemUrl };
