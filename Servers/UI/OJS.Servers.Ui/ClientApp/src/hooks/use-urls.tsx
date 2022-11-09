import React, { createContext, useContext, useMemo } from 'react';
import isNil from 'lodash/isNil';

import {
    IAllContestsUrlParams,
    IDownloadProblemResourceUrlParams,
    IGetContestResultsParams,
    IGetSubmissionDetailsByIdUrlParams,
    IGetSubmissionResultsByProblemAndUserUrlParams,
    IGetSubmissionResultsByProblemUrlParams,
    IRegisterForContestTypeUrlParams,
    IStartContestParticipationUrlParams,
    ISubmitContestPasswordUrlParams,
} from '../common/url-types';
import { IHaveChildrenProps } from '../components/common/Props';

interface IUrlsContext {
    getLoginSubmitUrl: () => string;
    getLogoutUrl: () => string;
    getAdministrationContestsGridUrl: () => string;
    getAdministrationNavigation: () => string;
    getProfileInfoUrl: () => string;
    getSubmissionsForProfileUrl: () => string;
    getParticipationsForProfileUrl: () => string;
    getRegisterContestTypeUrl: (params: IRegisterForContestTypeUrlParams) => string;
    getIndexContestsUrl: () => string;
    getAllContestsUrl: (params: IAllContestsUrlParams) => string;
    getRegisterForContestUrl: (params: IStartContestParticipationUrlParams) => string;
    getSubmitContestPasswordUrl: (params: ISubmitContestPasswordUrlParams) => string;
    getStartContestParticipationUrl: (params: IStartContestParticipationUrlParams) => string;
    getSubmissionResultsByProblemUrl: (params: IGetSubmissionResultsByProblemUrlParams) => string;
    getSubmissionResultsByProblemAndUserUrl: (params: IGetSubmissionResultsByProblemAndUserUrlParams) => string;
    getSubmissionsDetailsUrl: () => string;
    getSubmissionDetailsByIdUrl: (params: IGetSubmissionDetailsByIdUrlParams) => string;
    getSubmitUrl: () => string;
    getDownloadProblemResourceUrl: (params: IDownloadProblemResourceUrlParams) => string;
    getCategoriesTreeUrl: () => string;
    getAllContestStrategyFiltersUrl: () => string;
    getContestResultsUrl: (params: IGetContestResultsParams) => string;
    getHomeStatisticsUrl: () => string;
}

const UrlsContext = createContext<IUrlsContext>({} as IUrlsContext);

type IUrlsProviderProps = IHaveChildrenProps

const baseUrl = window.URLS.UI_URL;
const baseApiUrl = `${baseUrl}/api`;

// auth
const getLoginSubmitUrl = () => `${baseUrl}/Account/Login`;
const getLogoutUrl = () => `${baseUrl}/Account/Logout`;

// admin
const administrationBaseUrl = window.URLS.ADMINISTRATION_URL;
const getAdministrationContestsGridUrl = () => `${administrationBaseUrl}/Contests`;
const getAdministrationNavigation = () => '/administration';

// profile
const getProfileInfoUrl = () => `${baseApiUrl}/Users/GetProfileInfo`;
const getSubmissionsForProfileUrl = () => `${baseApiUrl}/Submissions/GetForProfile`;
const getParticipationsForProfileUrl = () => `${baseApiUrl}/Participations/GetForProfile`;

// contests
const getRegisterContestTypeUrl = ({
    id,
    participationType,
}: IRegisterForContestTypeUrlParams) => `/Contests/${id}/Register/${participationType}`;

const getIndexContestsUrl = () => `${baseApiUrl}/Contests/GetForHomeIndex`;
const getAllContestsUrl = ({ filters, page }: IAllContestsUrlParams) => {
    const filtersQuery = `${filters
        .map(({ value, type }) => `${type.toLowerCase()}=${value}`)
        .join('&')
    }`;

    const pageQuery = isNil(page)
        ? ''
        : `page=${page}`;

    return `${baseApiUrl}/Contests/GetAll?${filtersQuery}&${pageQuery}`;
};

const getRegisterForContestUrl = ({
    id,
    isOfficial,
}: IStartContestParticipationUrlParams) => `${baseApiUrl}/Contests/Register/${id}?official=${isOfficial}`;

const getSubmitContestPasswordUrl = ({
    id,
    isOfficial,
}: ISubmitContestPasswordUrlParams) => `${baseApiUrl}/Contests/SubmitContestPassword/${id}?official=${isOfficial}`;

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
    problemId,
    isOfficial,
    take,
}: IGetSubmissionResultsByProblemUrlParams) => `
    ${baseApiUrl}/Submissions/GetSubmissionResultsByProblem/${problemId}?isOfficial=${isOfficial}&take=${take}`;

const getSubmissionResultsByProblemAndUserUrl = ({
    problemId,
    isOfficial,
    take,
    userId,
}: IGetSubmissionResultsByProblemAndUserUrlParams) => `
${baseApiUrl}/Submissions/GetSubmissionResultsByProblemAndUser/${problemId}/${userId}?isOfficial=${isOfficial}&take=${take}`;

const getSubmissionsDetailsUrl = () => `${baseApiUrl}/Submissions/Details`;
const getSubmissionDetailsByIdUrl =
    ({ submissionId }: IGetSubmissionDetailsByIdUrlParams) => `${getSubmissionsDetailsUrl()}/${submissionId}`;
const getSubmitUrl = () => `${baseApiUrl}/Compete/Submit`;

// Submission types
const getAllContestStrategyFiltersUrl =
    () => `${baseApiUrl}/SubmissionTypes/GetAllOrderedByLatestUsage`;

// problem resources
const getDownloadProblemResourceUrl = ({ id }: IDownloadProblemResourceUrlParams) => `${baseApiUrl}/ProblemResources/GetResource/${id}`;

// Statistics
const getHomeStatisticsUrl = () => `${baseApiUrl}/StatisticsPreview/GetForHome`;

const UrlsProvider = ({ children }: IUrlsProviderProps) => {
    const value = useMemo(
        () => ({
            getLoginSubmitUrl,
            getLogoutUrl,
            getAdministrationContestsGridUrl,
            getAdministrationNavigation,
            getRegisterContestTypeUrl,
            getAllContestsUrl,
            getRegisterForContestUrl,
            getSubmitContestPasswordUrl,
            getStartContestParticipationUrl,
            getDownloadProblemResourceUrl,
            getSubmissionResultsByProblemUrl,
            getSubmissionResultsByProblemAndUserUrl,
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
            getHomeStatisticsUrl,
        }),
        [],
    );

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
