/* eslint-disable import/prefer-default-export */

import { ContestParticipationType } from './constants';

interface IParticipateInContestTypeUrlParams {
    id: number;
    participationType: ContestParticipationType;
}

export type { IParticipateInContestTypeUrlParams };
