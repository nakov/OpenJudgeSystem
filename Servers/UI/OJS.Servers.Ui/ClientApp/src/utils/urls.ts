import isNil from 'lodash/isNil';

import {
    IProblemSubmissionDetailsUrlParams,
    ISubmissionDetailsUrlParams,
} from '../common/app-url-types';
import {
    IContestDetailsUrlParams,
    IDownloadProblemResourceUrlParams,
    IGetContestParticipationScoresForParticipantUrlParams,
    IGetSubmissionResultsByProblemUrlParams,
    IGetUserSubmissionsForProfileByContestUrlParams,
    IGetUserSubmissionsUrlParams,
    IRetestSubmissionUrlParams,
    IStartContestParticipationUrlParams,
    ISubmitContestPasswordUrlParams,
    IUserInfoUrlParams,
} from '../common/url-types';

const baseUrl = `${import.meta.env.VITE_UI_SERVER_URL}`;
const administrationBaseUrl = `${import.meta.env.VITE_ADMINISTRATION_URL}`;
const platformBaseUrl = `${import.meta.env.VITE_PLATFORM_URL}`;

const baseApiUrl = `${baseUrl}/api`;

const getLoginPageUrl = () => `${baseUrl}/login`;

const getPlatformRegisterUrl = () => `${platformBaseUrl}/identity/register?returnUrl=${encodeURIComponent(getLoginPageUrl())}`;

const getPlatformForgottenPasswordUrl = () => `${platformBaseUrl}/account/forgottenpassword`;

// admin
const getAdministrationRetestSubmission = ({ id }: IRetestSubmissionUrlParams) => `
${administrationBaseUrl}/Submissions/Retest?PK=${id}`;

// profile

const getUserProfileInfoUrlByUsername = (username: string) => `/profile/${username}`;
const getSubmissionsForProfileUrl = ({ username, page } : IGetUserSubmissionsUrlParams) => {
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

// eslint-disable-next-line max-len
const getAllParticipationsForUserUrl = ({ username } : IUserInfoUrlParams) => `${baseApiUrl}/Participations/GetAllForUser?username=${username}`;

// contests
const getContestDetailsUrl =
    ({ id }: IContestDetailsUrlParams) => `${baseApiUrl}/Contests/Details/${id}`;

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

const getSubmissionDetailsRedirectionUrl = ({ submissionId }:ISubmissionDetailsUrlParams) => `/submissions/${submissionId}/details`;

const getSubmitUrl = () => `${baseApiUrl}/Compete/Submit`;
const getSubmitFileUrl = () => `${baseApiUrl}/Compete/SubmitFileSubmission`;

// problem resources
const getDownloadProblemResourceUrl = ({ id }: IDownloadProblemResourceUrlParams) => `${baseApiUrl}/ProblemResources/GetResource/${id}`;

const encodeAsUrlParam = (username: string) => username.replace(/\./g, '~');
const decodeFromUrlParam = (username: string) => username.replace(/~/g, '.');

export {
    getPlatformRegisterUrl,
    getPlatformForgottenPasswordUrl,
    getAdministrationRetestSubmission,
    getUserProfileInfoUrlByUsername,
    getSubmissionsForProfileUrl,
    getAllParticipationsForUserUrl,
    getSubmitContestPasswordUrl,
    getRegisterForContestUrl,
    getStartContestParticipationUrl,
    getContestParticipantScoresForParticipantUrl,
    getSubmissionsForProfileByContestUrl,
    getSubmissionResultsByProblemUrl,
    getSubmitUrl,
    getSubmitFileUrl,
    getProblemSubmissionDetailsUrl,
    getSubmissionDetailsRedirectionUrl,
    getDownloadProblemResourceUrl,
    getContestDetailsUrl,
    encodeAsUrlParam,
    decodeFromUrlParam,
};
