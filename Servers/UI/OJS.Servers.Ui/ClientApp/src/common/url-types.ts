/* eslint-disable import/prefer-default-export */

import { IFilter } from './contest-types';

interface IStartContestUrlParams {
    id: number;
    official: boolean;
}

interface IAllContestsUrlParams {
    filters: IFilter[];
    page?: number;
}

interface IContestCategoriesUrlParams {
    id: number;
}

interface IRegisterForContestUrlParams {
    id: number;
    isOfficial: boolean;
}

interface IStartContestParticipationUrlParams {
    id: number;
    isOfficial: boolean;
}

interface ISubmitContestPasswordUrlParams {
    id: number;
    isOfficial: boolean;
}

interface IDownloadProblemResourceUrlParams {
    id: number;
}

interface IGetSubmissionResultsByProblemUrlParams {
    id: number;
    isOfficial: boolean;
    take: number;
}

interface IGetSubmissionResultsByProblemAndUserUrlParams {
    problemId: number;
    isOfficial: boolean;
    take: number;
    userId: string;
}

interface IGetContestResultsParams {
    id: number;
    official: boolean;
    full: boolean;
}

interface IGetSubmissionDetailsByIdUrlParams {
    submissionId: number;
}

export type {
    IRegisterForContestUrlParams,
    ISubmitContestPasswordUrlParams,
    IStartContestUrlParams,
    IAllContestsUrlParams,
    IContestCategoriesUrlParams,
    IStartContestParticipationUrlParams,
    IDownloadProblemResourceUrlParams,
    IGetSubmissionResultsByProblemUrlParams,
    IGetSubmissionResultsByProblemAndUserUrlParams,
    IGetSubmissionDetailsByIdUrlParams,
    IGetContestResultsParams,
};
