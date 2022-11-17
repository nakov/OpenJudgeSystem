/* eslint-disable import/prefer-default-export */

import { ContestParticipationType } from './constants';

interface IRegisterForContestTypeUrlParams {
    id: number;
    participationType: ContestParticipationType;
}

export type { IRegisterForContestTypeUrlParams };
