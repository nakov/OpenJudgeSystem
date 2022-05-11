// TODO: https://github.com/SoftUni-Internal/exam-systems-issues/issues/133
const baseUrl = window.URLS.UI_URL;
const administrationBaseUrl = window.URLS.ADMINISTRATION_URL;

const loginSubmitUrl = `${baseUrl}/Account/Login`;
const logoutUrl = `${baseUrl}/Account/Logout`;

const getProfileInfoUrl = `${baseUrl}/Users/GetProfileInfo`;

const getIndexContestsUrl = `${baseUrl}/Contests/GetForHomeIndex`;

const startContestParticipationUrl = (id: number, isOfficial: boolean) => `${baseUrl}/Compete/Index/${id.toString()}?official=${isOfficial.toString()}`;

const getSubmissionDetailsUrl = `${baseUrl}/Submissions/Details`;
const getSubmissionsForProfileUrl = `${baseUrl}/Submissions/GetForProfile`;
const submitUrl = `${baseUrl}/Compete/Submit`;

const getParticipationsForProfileUrl = `${baseUrl}/Participations/GetForProfile`;

const downloadProblemResourceUrl = `${baseUrl}/ProblemResources/GetResource/%id%`;

const getSubmissionResultsByProblem = `${baseUrl}/Submissions/GetSubmissionResultsByProblem/%id%?isOfficial=%isOfficial%&take=%take%`;

const administrationContestsGridUrl = `${administrationBaseUrl}/Contests`;

export {
    loginSubmitUrl,
    logoutUrl,
    getProfileInfoUrl,
    getIndexContestsUrl,
    startContestParticipationUrl,
    getSubmissionDetailsUrl,
    getSubmissionsForProfileUrl,
    getParticipationsForProfileUrl,
    downloadProblemResourceUrl,
    getSubmissionResultsByProblem,
    submitUrl,
    administrationContestsGridUrl,
};
