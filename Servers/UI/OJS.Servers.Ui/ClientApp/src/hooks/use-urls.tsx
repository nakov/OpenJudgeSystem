import React, { createContext, useContext } from 'react';
import {
    IAllContestsUrlParams,
    IDownloadProblemResourceUrlParams, IGetCurrentSubmissionDetailsUrlParams, IGetSubmissionResultsByProblemUrlParams,
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
    getSubmissionDetailsByIdUrl: (params: IGetCurrentSubmissionDetailsUrlParams) => string;
    getSubmitUrl: () => string;
    getDownloadProblemResourceUrl: (params: IDownloadProblemResourceUrlParams) => string;
    getCategoriesTreeUrl: () => string;
    getAllContestStrategyFiltersUrl: () => string;
}

const UrlsContext = createContext<IUrlsContext>({} as IUrlsContext);

interface IUrlsProviderProps extends IHaveChildrenProps {
}

const baseUrl = window.URLS.UI_URL;

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
const getIndexContestsUrl = () => `${baseUrl}/Contests/GetForHomeIndex`;
const getAllContestsUrl = ({ filters, page }: IAllContestsUrlParams) => {
    const queryParams = `${filters
        .map(({ value, type }) => `${type.toLowerCase()}=${value}`)
        .join('&')
    }&page=${page}`;

    return `${baseUrl}/Contests/GetAll?${queryParams}`;
};

const getStartContestParticipationUrl = ({
    id,
    isOfficial,
}: IStartContestParticipationUrlParams) => `${baseUrl}/Compete/Index/${id}?official=${isOfficial}`;

const getCategoriesTreeUrl =
    () => `${baseUrl}/ContestCategories/GetCategoriesTree`;

// submissions
const getSubmissionResultsByProblemUrl = ({
    id,
    isOfficial,
    take,
}: IGetSubmissionResultsByProblemUrlParams) => `
    ${baseUrl}/Submissions/GetSubmissionResultsByProblem/${id}?isOfficial=${isOfficial}&take=${take}`;
const getSubmissionsDetailsUrl = () => `${baseUrl}/Submissions/Details`;
const getSubmissionDetailsByIdUrl =
    ({ submissionId }: IGetCurrentSubmissionDetailsUrlParams) => `${getSubmissionsDetailsUrl}/${submissionId}`;
const getSubmitUrl = () => `${baseUrl}/Compete/Submit`;

// Submission types
const getAllContestStrategyFiltersUrl =
    () => `${baseUrl}/SubmissionTypes/GetAll`;

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
