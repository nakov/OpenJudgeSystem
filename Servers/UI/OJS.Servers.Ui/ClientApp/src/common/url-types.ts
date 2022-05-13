/* eslint-disable import/prefer-default-export */

import { IFilter } from './contest-types';

interface IStartContestUrlParams {
    id: number;
    official: boolean;
}

interface IAllContestsUrlParams {
    filters: IFilter[];
}

interface IContestCategoriesUrlParams {
    id: number;
}

export type {
    IStartContestUrlParams,
    IAllContestsUrlParams,
    IContestCategoriesUrlParams,
};
