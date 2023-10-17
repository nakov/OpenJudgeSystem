import isNil from 'lodash/isNil';

import {
    IContestResultsUrl,
    IParticipateInContestTypeUrlParams,
    IProblemSubmissionDetailsUrlParams,
    ISubmissionDetailsUrlParams,
} from '../common/app-url-types';
import { ContestResultType } from '../common/constants';
import { FilterType } from '../common/contest-types';
import { SearchParams } from '../common/search-types';
import {
    IAllContestsUrlParams, IContestDetailsUrlParams,
    IContestEditUrlParams,
    IContestProblemsUrlParams,
    IDownloadProblemResourceUrlParams,
    IDownloadSubmissionFileUrlParams,
    IGetContestByProblemUrlParams,
    IGetContestParticipationScoresForParticipantUrlParams,
    IGetContestResultsParams,
    IGetSearchResultsUrlParams,
    IGetSubmissionDetailsByIdUrlParams,
    IGetSubmissionResultsByProblemUrlParams,
    IGetSubmissionsByContestIdParams,
    IGetSubmissionsUrlParams,
    IRetestSubmissionUrlParams,
    IStartContestParticipationUrlParams,
    ISubmitContestPasswordUrlParams,
} from '../common/url-types';

const
    {
        URLS:
            {
                UI_URL: baseUrl,
                ADMINISTRATION_URL: administrationBaseUrl,
                PLATFORM_URL: platformBaseUrl,
            },
    } = window;

const baseApiUrl = `${baseUrl}/api`;

// home
const getHomePageUrl = () => '/';

// auth
const getLoginSubmitUrl = () => `${baseUrl}/Account/Login`;
const getLogoutUrl = () => `${baseUrl}/Account/Logout`;

const getLoginPageUrl = () => `${baseUrl}/login`;

const getUserAuthInfoUrl = () => `${baseApiUrl}/Users/GetUserAuthInfo`;
const getPlatformRegisterUrl = () => `${platformBaseUrl}/identity/register?returnUrl=${encodeURIComponent(getLoginPageUrl())}`;

// admin
const getAdministrationContestsGridUrl = () => `${administrationBaseUrl}/Contests`;
const getAdministrationNavigation = () => '/administration';
const getAdministrationRetestSubmission = ({ id }: IRetestSubmissionUrlParams) => `
${administrationBaseUrl}/Submissions/Retest?PK=${id}`;
const getAdministrationRetestSubmissionInternalUrl = (id: string) => `/Submissions/Retest/${id}`;
const getAdministrationProblems = ({ id }: IContestProblemsUrlParams) => `
${administrationBaseUrl}/Problems?ContestId-equals=${id}`;
const getAdministrationContestEditUrl = ({ id }: IContestEditUrlParams) => `
${administrationBaseUrl}/Contests/Edit?PK=${id}`;

const getAdministrationContestProblemsInternalUrl = (id: string) => `/Contest/Problems/${id}`;

const getAdministrationContestEditInternalUrl = (id: string) => `/Contest/Edit/${id}`;

// profile
const getProfileInfoUrl = () => `${baseApiUrl}/Users/GetProfileInfo`;
const getSubmissionsForProfileUrl = () => `${baseApiUrl}/Submissions/GetForProfile`;
const getParticipationsForProfileUrl = () => `${baseApiUrl}/Participations/GetForProfile`;
const getAllParticipationsForUserUrl = () => '/api/Participations/GetAllForUser';

// contests
const getIndexContestsUrl = () => `${baseApiUrl}/Contests/GetForHomeIndex`;
const getAllContestsUrl = ({ filters, sorting, page }: IAllContestsUrlParams) => {
    const filtersQuery = `${filters
        .map(({ value, type }) => `${type.toLowerCase()}=${value}`)
        .join('&')
    }`;

    const sortingQuery = `${sorting
        .map(({ value, type }) => `${type.toLowerCase()}=${value}`)
        .join('&')
    }`;

    const pageQuery = isNil(page)
        ? ''
        : `page=${page}`;

    return `${baseApiUrl}/Contests/GetAll?${filtersQuery}&${sortingQuery}&${pageQuery}`;
};

const getParticipateInContestUrl = ({
    id,
    participationType,
}: IParticipateInContestTypeUrlParams) => `/contests/${id}/${participationType}`;

const getContestDetailsUrl =
    ({ id }: IContestDetailsUrlParams) => `${baseApiUrl}/Contests/Details/${id}`;

const getContestDetailsAppUrl = (id: number) => `/contests/${id}`;

const getRegisterForContestUrl = ({
    id,
    isOfficial,
}: IStartContestParticipationUrlParams) => `${baseApiUrl}/Contests/Register/${id}?official=${isOfficial}`;

const getSubmitContestPasswordUrl = ({
    id,
    isOfficial,
}: ISubmitContestPasswordUrlParams) => `${baseApiUrl}/Contests/SubmitContestPassword/${id}?official=${isOfficial}`;

const getStartContestParticipationUrl = ({
    id,
    isOfficial,
}: IStartContestParticipationUrlParams) => `${baseApiUrl}/Compete/Index/${id}?official=${isOfficial}`;

const getContestParticipantScoresForParticipantUrl =
    ({ participantId }: IGetContestParticipationScoresForParticipantUrlParams) => `
    ${baseApiUrl}/ParticipantScores/GetScoresForParticipant/${participantId}`;

const getContestByProblemUrl = ({ problemId }: IGetContestByProblemUrlParams) => `${baseApiUrl}/Contests/GetByProblem/${problemId}`;

const getCategoriesTreeUrl =
    () => `${baseApiUrl}/ContestCategories/GetCategoriesTree`;

const getContestCategoryBreadcrumbItemPath = (id: string) => `/Contests?${FilterType.Category.toString()}=${id}`;

const getContestResultsUrl = ({
    id,
    participationType,
}: IContestResultsUrl) => `/contests/${id}/${participationType}/results/${ContestResultType.Simple}`;

const getContestResultsApiUrl = ({
    id,
    official,
    full,
} : IGetContestResultsParams) => `${baseApiUrl}/ContestResults/GetResults/${id}?official=${official}&full=${full}`;

// submissions
const getSubmissionResultsByProblemUrl = ({
    problemId,
    isOfficial,
    take,
}: IGetSubmissionResultsByProblemUrlParams) => `
    ${baseApiUrl}/Submissions/GetSubmissionResultsByProblem/${problemId}?isOfficial=${isOfficial}&take=${take}`;

const getProblemSubmissionDetailsUrl = ({
    submissionId,
    hashParam,
}: IProblemSubmissionDetailsUrlParams) => `/submissions/${submissionId}/details#${hashParam}`;

const getSubmissionDetailsResultsUrl = ({
    submissionId,
    take,
}: IGetSubmissionDetailsByIdUrlParams) => `
    ${baseApiUrl}/Submissions/GetSubmissionDetailsWithResults/${submissionId}?take=${take}`;

const getPublicSubmissionsUrl = ({ page }: IGetSubmissionsUrlParams) => {
    const pageQuery = isNil(page)
        ? ''
        : `page=${page}`;

    return `${baseApiUrl}/Submissions/Public?${pageQuery}`;
};

const getUnprocessedSubmissionsUrl = ({ page }: IGetSubmissionsUrlParams) => {
    const pageQuery = isNil(page)
        ? ''
        : `page=${page}`;

    return `${baseApiUrl}/Submissions/GetProcessingSubmissions?${pageQuery}`;
};

const getPendingSubmissionsUrl = ({ page }: IGetSubmissionsUrlParams) => {
    const pageQuery = isNil(page)
        ? ''
        : `page=${page}`;

    return `${baseApiUrl}/Submissions/GetPendingSubmissions?${pageQuery}`;
};
const getSubmissionsTotalCountUrl = () => `${baseApiUrl}/Submissions/TotalCount`;
const getSubmissionsUnprocessedTotalCountUrl = () => `${baseApiUrl}/Submissions/UnprocessedTotalCount`;
const getSubmissionsDetailsUrl = () => `${baseApiUrl}/Submissions/Details`;
const getUserSubmissionsUrl = ({ page }: IGetSubmissionsUrlParams) => {
    const pageQuery = isNil(page)
        ? ''
        : `page=${page}`;

    return `${baseApiUrl}/Submissions/GetUserSubmissions?${pageQuery}`;
};
const getSubmissionDetailsByIdUrl =
    ({ submissionId }: IGetSubmissionDetailsByIdUrlParams) => `${getSubmissionsDetailsUrl()}/${submissionId}`;
const getSubmitUrl = () => `${baseApiUrl}/Compete/Submit`;
const getSubmitFileUrl = () => `${baseApiUrl}/Compete/SubmitFileSubmission`;
const getSubmissionFileDownloadUrl =
    ({ id }: IDownloadSubmissionFileUrlParams) => `${baseApiUrl}/Submissions/Download/${id}`;
const getSubmissionsByContestIdUrl = ({ contestId = '', page }: IGetSubmissionsByContestIdParams) => {
    const pageQuery = isNil(page)
        ? ''
        : `page=${page}`;

    const contestQuery = isNil(contestId)
        ? ''
        : `contestId=${contestId}`;

    return `${baseApiUrl}/Submissions/getUserSubmissionsByContest?${contestQuery}&${pageQuery}`;
};

const getSubmissionDetailsUrl = ({ id }:ISubmissionDetailsUrlParams) => `/submissions/${id}/details`;

// Submission types
const getAllContestStrategyFiltersUrl =
    () => `${baseApiUrl}/SubmissionTypes/GetAllOrderedByLatestUsage`;

// problem resources
const getDownloadProblemResourceUrl = ({ id }: IDownloadProblemResourceUrlParams) => `${baseApiUrl}/ProblemResources/GetResource/${id}`;

// Statistics
const getHomeStatisticsUrl = () => `${baseApiUrl}/StatisticsPreview/GetForHome`;

// Search
const getSearchResults = ({ searchTerm, page, selectedTerms }: IGetSearchResultsUrlParams) => {
    const searchQuery = `${SearchParams.search}=${searchTerm}`;

    const pageQuery = `page=${page}`;

    const selectedTermQuery = `&${selectedTerms
        .map(({ key, value }) => `${key}=${value}`)
        .join('&')
    }`;

    return `${baseApiUrl}/Search/GetSearchResults?${searchQuery}${selectedTermQuery}&${pageQuery}`;
};

export {
    getLoginSubmitUrl,
    getLogoutUrl,
    getUserAuthInfoUrl,
    getPlatformRegisterUrl,
    getAdministrationContestsGridUrl,
    getAdministrationNavigation,
    getAdministrationRetestSubmission,
    getProfileInfoUrl,
    getParticipateInContestUrl,
    getContestCategoryBreadcrumbItemPath,
    getSubmissionsForProfileUrl,
    getParticipationsForProfileUrl,
    getAllParticipationsForUserUrl,
    getIndexContestsUrl,
    getAllContestsUrl,
    getAdministrationRetestSubmissionInternalUrl,
    getSubmitContestPasswordUrl,
    getHomePageUrl,
    getRegisterForContestUrl,
    getStartContestParticipationUrl,
    getContestParticipantScoresForParticipantUrl,
    getContestResultsUrl,
    getContestResultsApiUrl,
    getCategoriesTreeUrl,
    getContestByProblemUrl,
    getSubmissionResultsByProblemUrl,
    getSubmissionDetailsResultsUrl,
    getPublicSubmissionsUrl,
    getSubmissionsByContestIdUrl,
    getUnprocessedSubmissionsUrl,
    getPendingSubmissionsUrl,
    getSubmissionsTotalCountUrl,
    getSubmissionsUnprocessedTotalCountUrl,
    getSubmissionsDetailsUrl,
    getUserSubmissionsUrl,
    getSubmissionDetailsByIdUrl,
    getSubmitUrl,
    getSubmitFileUrl,
    getProblemSubmissionDetailsUrl,
    getSubmissionFileDownloadUrl,
    getSubmissionDetailsUrl,
    getAllContestStrategyFiltersUrl,
    getDownloadProblemResourceUrl,
    getHomeStatisticsUrl,
    getSearchResults,
    getContestDetailsUrl,
    getContestDetailsAppUrl,
    getAdministrationProblems,
    getAdministrationContestEditUrl,
    getAdministrationContestEditInternalUrl,
    getAdministrationContestProblemsInternalUrl,
};
