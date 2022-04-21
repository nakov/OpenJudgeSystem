/* eslint-disable import/prefer-default-export */

import { IFilter } from './contest-types';

interface IStartContestUrlParams {
    id: number;
    official: boolean;
}

interface IAllContestsUrlParams {
    filters: IFilter[];
}

export type {
    IStartContestUrlParams,
    IAllContestsUrlParams,
};
