// TODO: https://github.com/SoftUni-Internal/exam-systems-issues/issues/133

const loginSubmitUrl = `${window.URLS.UI_URL}/Account/Login`;
const logoutUrl = `${window.URLS.UI_URL}/Account/Logout`;

const getProfileInfoUrl = `${window.URLS.UI_URL}/Users/GetProfileInfo`;

const getIndexContestsUrl = `${window.URLS.UI_URL}/Contests/GetForHomeIndex`;
const startContestParticipationUrl = `${window.URLS.UI_URL}/Compete/Index/%id%?official=%official%`;

const getSubmissionDetailsUrl = `${window.URLS.UI_URL}/Submissions/Details`;
const getSubmissionsForProfileUrl = `${window.URLS.UI_URL}/Submissions/GetForProfile`;
const submitUrl = `${window.URLS.UI_URL}/Compete/Submit`;

const getParticipationsForProfileUrl = `${window.URLS.UI_URL}/Participations/GetForProfile`;

const downloadProblemResourceUrl = `${window.URLS.UI_URL}/ProblemResources/GetResource/%id%`;

const getSubmissionResultsByProblem = `
${window.URLS.UI_URL}/Submissions/GetSubmissionResultsByProblem/%id%?isOfficial=%isOfficial%&take=%take%`;

const administrationContestsGridUrl = `${window.URLS.ADMINISTRATION_URL}/Contests`;

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
