// TODO: https://github.com/SoftUni-Internal/exam-systems-issues/issues/133
import DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE from '../common/constants';

const baseUrl = window.URLS.UI_URL;
const administrationBaseUrl = window.URLS.ADMINISTRATION_URL;

const loginSubmitUrl = `${baseUrl}/Account/Login`;
const logoutUrl = `${baseUrl}/Account/Logout`;

const getProfileInfoUrl = `${baseUrl}/Users/GetProfileInfo`;

const getIndexContestsUrl = `${baseUrl}/Contests/GetForHomeIndex`;
const startContestParticipationUrl = (
    id: number | undefined,
    isOfficial: boolean,
) => {
    console.log(id);
    console.log(isOfficial);
    return `${baseUrl}/Compete/Index/${id?.toString()}?official=${isOfficial}`;
};

const getSubmissionDetailsUrl = `${baseUrl}/Submissions/Details`;
const getSubmissionsForProfileUrl = `${baseUrl}/Submissions/GetForProfile`;
const submitUrl = `${baseUrl}/Compete/Submit`;

const getParticipationsForProfileUrl = () => `${baseUrl}/Participations/GetForProfile`;

const getProblemResourceUrl = (id: number) => `${baseUrl}/ProblemResources/GetResource/${id}`;

const getSubmissionResultsByProblem = (
    id: number,
    isOfficial: boolean,
    take?: number,
) => `${baseUrl}/Submissions/GetSubmissionResultsByProblem/${id.toString()}?isOfficial=${isOfficial}&take=${
    take == null
        ? DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE
        : take.toString()}`;

const administrationContestsGridUrl = () => `${administrationBaseUrl}/Contests`;

export {
    loginSubmitUrl,
    logoutUrl,
    getProfileInfoUrl,
    getIndexContestsUrl,
    startContestParticipationUrl,
    getSubmissionDetailsUrl,
    getSubmissionsForProfileUrl,
    getParticipationsForProfileUrl,
    getProblemResourceUrl,
    getSubmissionResultsByProblem,
    submitUrl,
    administrationContestsGridUrl,
};
