/* eslint-disable import/prefer-default-export */
import { ISort, IFilter } from './contest-types';
import { SubmissionStatus } from '../hooks/submissions/use-public-submissions';

interface IContestDetailsUrlParams {
    id: number;
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
    status: SubmissionStatus;
    page: number;
}

interface IGetUserSubmissionsUrlParams {
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
    page: number;
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

interface ITerm {
    key: string;
    value: string;
}

interface IGetSearchResultsUrlParams {
    searchTerm: string;
    selectedTerms: ITerm[];
}

interface IGetSearchResultsParams {
    searchTerm: string;
    page: number;
    searchCategory: string;
}

export type {
    IRegisterForContestUrlParams,
    ISubmitContestPasswordUrlParams,
    IContestDetailsUrlParams,
    IAllContestsUrlParams,
    IGetSearchResultsParams,
    IContestCategoriesUrlParams,
    IStartContestParticipationUrlParams,
    IGetContestParticipationScoresForParticipantUrlParams,
    IDownloadProblemResourceUrlParams,
    IGetSubmissionsUrlParams,
    IGetUserSubmissionsUrlParams,
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
