import isNil from 'lodash/isNil';

import {
    IContestResultsUrl,
    IParticipateInContestTypeUrlParams,
    IProblemSubmissionDetailsUrlParams,
} from '../common/app-url-types';
import { ContestResultType } from '../common/constants';
import { FilterType } from '../common/contest-types';
import { SearchParams } from '../common/search-types';
import {
    IAllContestsUrlParams,
    IDownloadProblemResourceUrlParams,
    IDownloadSubmissionFileUrlParams,
    IGetContestByProblemUrlParams,
    IGetContestParticipationScoresForParticipantUrlParams,
    IGetContestResultsParams,
    IGetSearchResultsUrlParams,
    IGetSubmissionDetailsByIdUrlParams,
    IGetSubmissionResultsByProblemUrlParams,
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

const getUserAuthInfoUrl = () => `${baseApiUrl}/Users/GetUserAuthInfo`;
const getPlatformRegisterUrl = () => `${platformBaseUrl}/identity/register`;

// admin
const getAdministrationContestsGridUrl = () => `${administrationBaseUrl}/Contests`;
const getAdministrationNavigation = () => '/administration';
const getAdministrationRetestSubmission = ({ id }: IRetestSubmissionUrlParams) => `
${administrationBaseUrl}/Submissions/Retest?PK=${id}`;
const getAdministrationRetestSubmissionInternalUrl = () => '/Submissions/Retest';

// profile
const getProfileInfoUrl = () => `${baseApiUrl}/Users/GetProfileInfo`;
const getSubmissionsForProfileUrl = () => `${baseApiUrl}/Submissions/GetForProfile`;
const getParticipationsForProfileUrl = () => `${baseApiUrl}/Participations/GetForProfile`;

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
    isOfficial,
    take,
}: IGetSubmissionDetailsByIdUrlParams) => `
    ${baseApiUrl}/Submissions/GetSubmissionDetailsResults/${submissionId}?isOfficial=${isOfficial}&take=${take}`;
const getPublicSubmissionsUrl = () => `${baseApiUrl}/Submissions/Public`;
const getSubmissionsTotalCountUrl = () => `${baseApiUrl}/Submissions/TotalCount`;
const getSubmissionsDetailsUrl = () => `${baseApiUrl}/Submissions/Details`;
const getSubmissionDetailsByIdUrl =
    ({ submissionId }: IGetSubmissionDetailsByIdUrlParams) => `${getSubmissionsDetailsUrl()}/${submissionId}`;
const getSubmitUrl = () => `${baseApiUrl}/Compete/Submit`;
const getSubmitFileUrl = () => `${baseApiUrl}/Compete/SubmitFileSubmission`;
const getSubmissionFileDownloadUrl =
    ({ id }: IDownloadSubmissionFileUrlParams) => `${baseApiUrl}/Submissions/Download/${id}`;

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
    getSubmissionsTotalCountUrl,
    getSubmissionsDetailsUrl,
    getSubmissionDetailsByIdUrl,
    getSubmitUrl,
    getSubmitFileUrl,
    getProblemSubmissionDetailsUrl,
    getSubmissionFileDownloadUrl,
    getAllContestStrategyFiltersUrl,
    getDownloadProblemResourceUrl,
    getHomeStatisticsUrl,
    getSearchResults,
};
