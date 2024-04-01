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
    IAllContestsUrlParams,
    IContestDetailsUrlParams,
    IContestEditUrlParams,
    IContestProblemsUrlParams,
    IDownloadProblemResourceUrlParams,
    IDownloadSubmissionFileUrlParams,
    IGetContestByProblemUrlParams,
    IGetContestParticipationScoresForParticipantUrlParams,
    IGetContestResultsParams,
    IGetSearchResultsParams,
    IGetSubmissionDetailsByIdUrlParams,
    IGetSubmissionResultsByProblemUrlParams,
    IGetSubmissionsUrlParams,
    IGetUserSubmissionsForProfileByContestUrlParams,
    IGetUserSubmissionsForProfileUrlParams,
    IRetestSubmissionUrlParams,
    IStartContestParticipationUrlParams,
    ISubmitContestPasswordUrlParams,
    IUserInfoUrlParams,
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
const getLoginSubmitUrl = () => `${baseApiUrl}/Account/Login`;
const getLogoutUrl = () => `${baseApiUrl}/Account/Logout`;

const getLoginPageUrl = () => `${baseUrl}/login`;
const getLoginPath = () => '/login';

const getUserAuthInfoUrl = () => `${baseApiUrl}/Users/GetUserAuthInfo`;
const getPlatformRegisterUrl = () => `${platformBaseUrl}/identity/register?returnUrl=${encodeURIComponent(getLoginPageUrl())}`;

// admin
const getAdministrationContestsGridUrl = () => `${administrationBaseUrl}/Contests`;
const getAdministrationNavigation = () => '/administration';
const getAdministrationRetestSubmission = ({ id }: IRetestSubmissionUrlParams) => `
${administrationBaseUrl}/Submissions/Retest?PK=${id}`;
const getAdministrationRetestSubmissionInternalUrl = ({ id }: IRetestSubmissionUrlParams) => `/Submissions/Retest/${id}`;
const getAdministrationProblems = ({ id }: IContestProblemsUrlParams) => `
${administrationBaseUrl}/Problems?ContestId-equals=${id}`;
const getAdministrationContestEditUrl = ({ id }: IContestEditUrlParams) => `
${administrationBaseUrl}/Contests/Edit?PK=${id}`;
const getAdministrationTestEditUrl = (id: string) => `${administrationBaseUrl}/Tests/Edit?PK=${id}`;

const getAdministrationContestProblemsInternalUrl = (id: string) => `/Contest/Problems/${id}`;
const getAdministrationContestEditInternalUrl = (id: string) => `/Contest/Edit/${id}`;
const getAdministrationTestEditInternalUrl = (id: string) => `/Tests/Edit/${id}`;

const getAdministrationParticipants = (id : number) => `
${administrationBaseUrl}/Participants?ContestId-equals=${id}`;

const getAdministrationTestsByProblem = (id : number) => `
${administrationBaseUrl}/Tests?ProblemId-equals=${id}`;

const administrationEditProblem = (id : number) => `
${administrationBaseUrl}/Problems/Edit?PK=${id}`;

const administrationDeleteProblem = (id : number) => `
${administrationBaseUrl}/Problems/Delete?PK=${id}`;

// profile

const getUserProfileInfoUrlByUsername = (username: string) => `/profile/${username}`;
const getProfileInfoUrl = ({ username } : IUserInfoUrlParams) => `${baseApiUrl}/Users/GetProfileInfo?username=${username}`;
const getSubmissionsForProfileUrl = ({ username, page } : IGetUserSubmissionsForProfileUrlParams) => {
    const usernameQuery = `username=${username}`;
    const pageQuery = `page=${page}`;

    return `${baseApiUrl}/Submissions/GetForProfile/?${usernameQuery}&${pageQuery}`;
};
const getSubmissionsForProfileByContestUrl = ({ username, page, contestId } : IGetUserSubmissionsForProfileByContestUrlParams) => {
    const usernameQuery = `username=${username}`;
    const pageQuery = `page=${page}`;
    const contestQuery = `contestId=${contestId}`;

    return `${baseApiUrl}/Submissions/GetUserSubmissionsForProfileByContest/?${usernameQuery}&${pageQuery}&${contestQuery}`;
};
const getParticipationsForProfileUrl = () => `${baseApiUrl}/Participations/GetForProfile`;
// eslint-disable-next-line max-len
const getAllParticipationsForUserUrl = ({ username } : IUserInfoUrlParams) => `${baseApiUrl}/Participations/GetAllForUser?username=${username}`;

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

const getContestsByStrategyUrl = (id: number) => `${baseUrl}/Contests?strategy=${id}&page=1`;

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
    page,
}: IGetSubmissionResultsByProblemUrlParams) => {
    const pageQuery = isNil(page)
        ? ''
        : `page=${page}`;

    return `${baseApiUrl}/Submissions/GetSubmissionResultsByProblem/${problemId}?isOfficial=${isOfficial}&${pageQuery}`;
};

const getProblemSubmissionDetailsUrl = ({ submissionId }: IProblemSubmissionDetailsUrlParams) => `/submissions/${submissionId}/details`;

const getSubmissionResultsUrl = ({
    submissionId,
    page,
}: IGetSubmissionDetailsByIdUrlParams) => {
    const pageQuery = isNil(page)
        ? ''
        : `page=${page}`;

    return `${baseApiUrl}/Submissions/GetSubmissionResults/${submissionId}?${pageQuery}`;
};

const getSubmissionDetailsUrl = ({ submissionId }:ISubmissionDetailsUrlParams) => `${baseApiUrl}/Submissions/Details/${submissionId}`;

const getSubmissionDetailsRedirectionUrl = ({ submissionId }:ISubmissionDetailsUrlParams) => `/submissions/${submissionId}/details`;

const getSubmissionsUrl = ({ status, page }: IGetSubmissionsUrlParams) => {
    const params = { status, page };
    const query = Object.entries(params)
        .filter(([ value ]) => !isNil(value))
        .map(([ key, value ]) => `${key}=${value}`)
        .join('&');

    return `${baseApiUrl}/Submissions/GetSubmissions?${query}`;
};

const getSubmissionsTotalCountUrl = () => `${baseApiUrl}/Submissions/TotalCount`;
const getSubmissionsUnprocessedTotalCountUrl = () => `${baseApiUrl}/Submissions/UnprocessedTotalCount`;
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

const getSearchPageURL = () => '/search';
const getSearchResultsUrl = ({ searchTerm, page, searchCategory }: IGetSearchResultsParams) => {
    const searchQuery = `${SearchParams.search}=${searchTerm}`;

    const pageQuery = `page=${page}`;

    return `${baseApiUrl}/Search/Get${searchCategory}SearchResults?${searchQuery}&${searchCategory}=true&${pageQuery}`;
};

// eslint-disable-next-line consistent-return
const getContestBtnUrlString = (isCompete: boolean, id: number) => {
    if (isCompete) {
        return `/contests/${id}/compete`;
    }

    return `/contests/${id}/practice`;
};

// Username url utils for decoding/encoding usernames containing '.'

const encodeUsernameAsUrlParam = (username: string) => username.replace(/\./g, '~');
const decodeUsernameFromUrlParam = (username: string) => username.replace(/~/g, '.');

export {
    getLoginSubmitUrl,
    getLogoutUrl,
    getLoginPath,
    getSearchPageURL,
    getSearchResultsUrl,
    getUserAuthInfoUrl,
    getPlatformRegisterUrl,
    getAdministrationContestsGridUrl,
    getAdministrationNavigation,
    getAdministrationRetestSubmission,
    getUserProfileInfoUrlByUsername,
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
    getSubmissionsForProfileByContestUrl,
    getContestResultsUrl,
    getContestResultsApiUrl,
    getCategoriesTreeUrl,
    getContestByProblemUrl,
    getSubmissionResultsByProblemUrl,
    getSubmissionResultsUrl,
    getSubmissionsTotalCountUrl,
    getSubmissionsUnprocessedTotalCountUrl,
    getSubmitUrl,
    getSubmitFileUrl,
    getProblemSubmissionDetailsUrl,
    getSubmissionDetailsRedirectionUrl,
    getSubmissionFileDownloadUrl,
    getSubmissionDetailsUrl,
    getAllContestStrategyFiltersUrl,
    getDownloadProblemResourceUrl,
    getHomeStatisticsUrl,
    getContestDetailsUrl,
    getContestDetailsAppUrl,
    getAdministrationProblems,
    getAdministrationContestEditUrl,
    getAdministrationContestEditInternalUrl,
    getAdministrationContestProblemsInternalUrl,
    administrationEditProblem,
    administrationDeleteProblem,
    getAdministrationTestsByProblem,
    getAdministrationParticipants,
    getContestsByStrategyUrl,
    getAdministrationTestEditUrl,
    getAdministrationTestEditInternalUrl,
    getSubmissionsUrl,
    encodeUsernameAsUrlParam,
    decodeUsernameFromUrlParam,
    getContestBtnUrlString,
};
