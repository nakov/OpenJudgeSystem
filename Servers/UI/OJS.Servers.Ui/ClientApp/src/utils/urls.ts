const baseUrl = window.URLS.UI_URL;
const administrationBaseUrl = window.URLS.ADMINISTRATION_URL;

const loginSubmitUrl = `${baseUrl}/Account/Login`;
const logoutUrl = `${baseUrl}/Account/Logout`;

const getProfileInfoUrl = `${baseUrl}/Users/GetProfileInfo`;

const getIndexContestsUrl = `${baseUrl}/Contests/GetForHomeIndex`;
const startContestParticipationUrl = `${baseUrl}/Compete/Index/%id%?official=%official%`;

const getSubmissionDetailsUrl = `${baseUrl}/Submissions/Details`;
const getSubmissionsForProfileUrl = `${baseUrl}/Submissions/GetForProfile`;
const submitUrl = `${baseUrl}/Compete/Submit?official=%official%`;

const getParticipationsForProfileUrl = `${baseUrl}/Participations/GetForProfile`;

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
    submitUrl,
    administrationContestsGridUrl,
};
