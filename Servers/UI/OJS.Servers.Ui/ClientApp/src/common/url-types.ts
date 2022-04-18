/* eslint-disable import/prefer-default-export */

import { ContestState } from './contest-types';

interface IStartContestUrlParams {
    id: number;
    official: boolean;
}

interface IAllContestsUrlParams {
    filter: ContestState | null;
}

export type {
    IStartContestUrlParams,
    IAllContestsUrlParams,
};
