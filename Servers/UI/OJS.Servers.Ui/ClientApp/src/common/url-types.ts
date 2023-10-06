/* eslint-disable import/prefer-default-export */
import { IFilter, ISort } from './contest-types';

interface IContestDetailsUrlParams {
    id: number;
    isOfficial: boolean;
}

interface IGetContestByProblemUrlParams {
    problemId: number;
}

interface IAllContestsUrlParams {
    filters: IFilter[];
    sorting: ISort[];
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

interface IGetContestParticipationScoresForParticipantUrlParams {
    participantId: number;
}

interface ISubmitContestPasswordUrlParams {
    id: number;
    isOfficial: boolean;
}

interface IDownloadProblemResourceUrlParams {
    id: number | null;
}

interface IDownloadSubmissionFileUrlParams {
    id: number | null;
}

interface IGetSubmissionsUrlParams {
    page: number;
}

interface IGetSubmissionsByContestIdParams {
    page: number;
    contestId: string | string[] | undefined;
}

interface IGetSubmissionResultsByProblemUrlParams {
    problemId: number;
    isOfficial: boolean;
    page: number;
}

interface IGetContestResultsParams {
    id: number;
    official: boolean;
    full: boolean;
}

interface IGetSubmissionDetailsByIdUrlParams {
    submissionId: number;
    take: number;
}

interface IRetestSubmissionUrlParams {
    id: number;
}

interface IContestProblemsUrlParams {
    id: number;
}

interface IContestEditUrlParams {
    id: number;
}

interface IGetSearchResultsUrlParams {
    searchTerm: string;
    page: number;
    selectedTerms: [];
}

export type {
    IRegisterForContestUrlParams,
    ISubmitContestPasswordUrlParams,
    IContestDetailsUrlParams,
    IAllContestsUrlParams,
    IContestCategoriesUrlParams,
    IStartContestParticipationUrlParams,
    IGetContestParticipationScoresForParticipantUrlParams,
    IDownloadProblemResourceUrlParams,
    IGetSubmissionsUrlParams,
    IGetSubmissionResultsByProblemUrlParams,
    IGetSubmissionDetailsByIdUrlParams,
    IGetContestResultsParams,
    IRetestSubmissionUrlParams,
    IGetSearchResultsUrlParams,
    IGetContestByProblemUrlParams,
    IDownloadSubmissionFileUrlParams,
    IContestProblemsUrlParams,
    IContestEditUrlParams,
    IGetSubmissionsByContestIdParams,
};
