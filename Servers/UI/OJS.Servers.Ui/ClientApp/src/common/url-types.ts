/* eslint-disable import/prefer-default-export */

import { IFilter } from './contest-types';

interface IStartContestUrlParams {
    id: number;
    official: boolean;
}

interface IAllContestsUrlParams {
    filters: IFilter[];
}

interface IStartContestParticipationUrlParams {
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

interface IGetSubmissionDetailsByIdUrlParams {
    submissionId: number;
}

export type {
    IStartContestUrlParams,
    IAllContestsUrlParams,
    IStartContestParticipationUrlParams,
    IDownloadProblemResourceUrlParams,
    IGetSubmissionResultsByProblemUrlParams,
    IGetSubmissionDetailsByIdUrlParams,
};
