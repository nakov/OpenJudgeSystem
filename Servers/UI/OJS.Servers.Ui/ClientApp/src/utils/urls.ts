const testSystemUrl = process.env.REACT_APP_SULS_TEST_SYSTEM_BASE_URL;
const testSystemApiBaseUrl = `${testSystemUrl}/api`;

const loginPageUrl = `${process.env.REACT_APP_BASE_URL}/login`;
// eslint-disable-next-line max-len
const authorityRegisterUrl = `${process.env.REACT_APP_PLATFORM_IDENTITY_BASE_URL}${process.env.REACT_APP_PLATFORM_IDENTITY_REGISTER_URL_POSTFIX}`;
const authorityRegisterFullUrl = `${authorityRegisterUrl}${encodeURIComponent(loginPageUrl)}`;
const getSessionIdUrl = `${testSystemApiBaseUrl}/Auth/GetSessionId`;
const testApiBaseUrl = `${testSystemApiBaseUrl}/Tests`;
const allAvailableTestsUrl = `${testApiBaseUrl}/GetAllAvailableTests`;
const startTestUrl = `${testApiBaseUrl}/StartTest`;
const getTestUrl = `${testApiBaseUrl}/GetTest`;
const continueTestUrl = `${testApiBaseUrl}/ContinueTest`;
const endTestUrl = `${testApiBaseUrl}/EndTest`;
const getTestResultUrl = `${testApiBaseUrl}/GetResult`;

export {
    authorityRegisterFullUrl,
    loginPageUrl,
    getSessionIdUrl,
    allAvailableTestsUrl,
    startTestUrl,
    continueTestUrl,
    endTestUrl,
    getTestResultUrl,
    getTestUrl,
};
