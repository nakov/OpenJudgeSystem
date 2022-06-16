import React, { createContext, useContext } from 'react';
import {
    IAllContestsUrlParams,
    IDownloadProblemResourceUrlParams,
    IGetContestResultsParams,
    IGetSubmissionDetailsByIdUrlParams,
    IGetSubmissionResultsByProblemUrlParams,
    IStartContestParticipationUrlParams,
} from '../common/url-types';
import { IHaveChildrenProps } from '../components/common/Props';

interface IUrlsContext {
    getLoginSubmitUrl: () => string;
    getLogoutUrl: () => string;
    getAdministrationContestsGridUrl: () => string;
    getProfileInfoUrl: () => string;
    getSubmissionsForProfileUrl: () => string;
    getParticipationsForProfileUrl: () => string;
    getIndexContestsUrl: () => string;
    getAllContestsUrl: (params: IAllContestsUrlParams) => string;
    getStartContestParticipationUrl: (params: IStartContestParticipationUrlParams) => string;
    getSubmissionResultsByProblemUrl: (params: IGetSubmissionResultsByProblemUrlParams) => string;
    getSubmissionsDetailsUrl: () => string;
    getSubmissionDetailsByIdUrl: (params: IGetSubmissionDetailsByIdUrlParams) => string;
    getSubmitUrl: () => string;
    getDownloadProblemResourceUrl: (params: IDownloadProblemResourceUrlParams) => string;
    getCategoriesTreeUrl: () => string;
    getAllContestStrategyFiltersUrl: () => string;
    getContestResultsUrl: (params: IGetContestResultsParams) => string;
}

const UrlsContext = createContext<IUrlsContext>({} as IUrlsContext);

interface IUrlsProviderProps extends IHaveChildrenProps {
}

const baseUrl = window.URLS.UI_URL;
const baseApiUrl = `${baseUrl}/api`;

// auth
const getLoginSubmitUrl = () => `${baseUrl}/Account/Login`;
const getLogoutUrl = () => `${baseUrl}/Account/Logout`;

// admin
const administrationBaseUrl = window.URLS.ADMINISTRATION_URL;
const getAdministrationContestsGridUrl = () => `${administrationBaseUrl}/Contests`;

// profile
const getProfileInfoUrl = () => `${baseUrl}/Users/GetProfileInfo`;
const getSubmissionsForProfileUrl = () => `${baseUrl}/Submissions/GetForProfile`;
const getParticipationsForProfileUrl = () => `${baseUrl}/Participations/GetForProfile`;

// contests
const getIndexContestsUrl = () => `${baseApiUrl}/Contests/GetForHomeIndex`;
const getAllContestsUrl = ({ filters, page }: IAllContestsUrlParams) => {
    const queryParams = `${filters
        .map(({ value, type }) => `${type.toLowerCase()}=${value}`)
        .join('&')
    }&page=${page}`;

    return `${baseApiUrl}/Contests/GetAll?${queryParams}`;
};

const getStartContestParticipationUrl = ({
    id,
    isOfficial,
}: IStartContestParticipationUrlParams) => `${baseApiUrl}/Compete/Index/${id}?official=${isOfficial}`;

const getCategoriesTreeUrl =
    () => `${baseApiUrl}/ContestCategories/GetCategoriesTree`;

const getContestResultsUrl = ({
    id,
    official,
    full,
} : IGetContestResultsParams) => `${baseApiUrl}/ContestResults/GetResults/${id}?official=${official}&full=${full}`;

// submissions
const getSubmissionResultsByProblemUrl = ({
    id,
    isOfficial,
    take,
}: IGetSubmissionResultsByProblemUrlParams) => `
    ${baseUrl}/Submissions/GetSubmissionResultsByProblem/${id}?isOfficial=${isOfficial}&take=${take}`;
const getSubmissionsDetailsUrl = () => `${baseUrl}/Submissions/Details`;
const getSubmissionDetailsByIdUrl =
    ({ submissionId }: IGetSubmissionDetailsByIdUrlParams) => `${getSubmissionsDetailsUrl()}/${submissionId}`;
const getSubmitUrl = () => `${baseApiUrl}/Compete/Submit`;

// Submission types
const getAllContestStrategyFiltersUrl =
    () => `${baseUrl}/SubmissionTypes/GetAllOrderedByLatestUsage`;

// problem resources
const getDownloadProblemResourceUrl = ({ id }: IDownloadProblemResourceUrlParams) => `
    ${baseUrl}/ProblemResources/GetResource/${id}
`;

const UrlsProvider = ({ children }: IUrlsProviderProps) => {
    const value = {
        getLoginSubmitUrl,
        getLogoutUrl,
        getAdministrationContestsGridUrl,
        getAllContestsUrl,
        getStartContestParticipationUrl,
        getDownloadProblemResourceUrl,
        getSubmissionResultsByProblemUrl,
        getIndexContestsUrl,
        getProfileInfoUrl,
        getSubmissionsDetailsUrl,
        getSubmissionDetailsByIdUrl,
        getSubmissionsForProfileUrl,
        getParticipationsForProfileUrl,
        getSubmitUrl,
        getCategoriesTreeUrl,
        getAllContestStrategyFiltersUrl,
        getContestResultsUrl,
    };

    return (
        <UrlsContext.Provider value={value}>
            {children}
        </UrlsContext.Provider>
    );
};
const useUrls = () => useContext(UrlsContext);

export default UrlsProvider;

export {
    useUrls,
};
