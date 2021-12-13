const baseUrl = process.env.REACT_APP_BASE_URL;

const loginSubmitUrl = `${baseUrl}/Account/Login`;
const logoutUrl = `${baseUrl}/Account/Logout`;

export {
    loginSubmitUrl,
    logoutUrl,
};
