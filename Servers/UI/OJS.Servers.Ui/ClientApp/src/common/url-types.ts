/* eslint-disable import/prefer-default-export */

import { ContestParticipationType } from './constants';
import { IFilter } from './contest-types';

interface IRegisterForContestTypeUrlParams {
    id: number;
    participationType: ContestParticipationType;
}

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
    problemId: number;
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
    IRegisterForContestTypeUrlParams,
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
