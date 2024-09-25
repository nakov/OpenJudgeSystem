import {
    ISubmissionDetailsUrlParams,
} from '../common/app-url-types';
import {
    IRetestSubmissionUrlParams,
} from '../common/url-types';

const baseUrl = `${import.meta.env.VITE_UI_SERVER_URL}`;
const administrationBaseUrl = `${import.meta.env.VITE_ADMINISTRATION_URL}`;
const platformBaseUrl = `${import.meta.env.VITE_PLATFORM_URL}`;

const getLoginPageUrl = () => `${baseUrl}/login`;

const getPlatformRegisterUrl = () => `${platformBaseUrl}/identity/register?returnUrl=${encodeURIComponent(getLoginPageUrl())}`;

const getPlatformForgottenPasswordUrl = () => `${platformBaseUrl}/account/forgottenpassword`;

// admin
const getAdministrationRetestSubmission = ({ id }: IRetestSubmissionUrlParams) => `
${administrationBaseUrl}/Submissions/Retest?PK=${id}`;

// profile
const getUserProfileInfoUrlByUsername = (username: string) => `/profile/${username}`;

const getSubmissionDetailsRedirectionUrl = ({ submissionId }:ISubmissionDetailsUrlParams) => `/submissions/${submissionId}/details`;

const encodeAsUrlParam = (username: string) => username.replace(/\./g, '~');
const decodeFromUrlParam = (username: string) => username.replace(/~/g, '.');

export {
    getPlatformRegisterUrl,
    getPlatformForgottenPasswordUrl,
    getAdministrationRetestSubmission,
    getUserProfileInfoUrlByUsername,
    getSubmissionDetailsRedirectionUrl,
    encodeAsUrlParam,
    decodeFromUrlParam,
};
