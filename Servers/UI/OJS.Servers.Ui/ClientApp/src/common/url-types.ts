/* eslint-disable import/prefer-default-export */

import { IFilter } from './contest-types';
import { ContestParticipationType } from './constants';

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
    id: number;
    isOfficial: boolean;
    take: number;
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
    IGetSubmissionDetailsByIdUrlParams,
    IGetContestResultsParams,
};
