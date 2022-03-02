const baseUrl = process.env.REACT_APP_BASE_URL;

const loginSubmitUrl = `${baseUrl}/Account/Login`;
const logoutUrl = `${baseUrl}/Account/Logout`;

const getProfileInfoUrl = `${baseUrl}/Users/GetProfileInfo`;

const getIndexContestsUrl = `${baseUrl}/Contests/GetForHomeIndex`;
const startContestParticipationUrl = `${baseUrl}/Compete/Index/%id%?official=%official%`;

const getAllowedSubmissionTypesForProblemUrl = `${baseUrl}/SubmissionTypes/GetAllowedByProblem/%id%`;

const getSubmissionDetailsUrl = `${baseUrl}/Submissions/Details`;
const getSubmissionsForProfileUrl = `${baseUrl}/Submissions/GetForProfile`;

const getParticipationsForProfileUrl = `${baseUrl}/Participations/GetForProfile`;

export {
    loginSubmitUrl,
    logoutUrl,
    getProfileInfoUrl,
    getIndexContestsUrl,
    startContestParticipationUrl,
    getAllowedSubmissionTypesForProblemUrl,
    getSubmissionDetailsUrl,
    getSubmissionsForProfileUrl,
    getParticipationsForProfileUrl,
};
