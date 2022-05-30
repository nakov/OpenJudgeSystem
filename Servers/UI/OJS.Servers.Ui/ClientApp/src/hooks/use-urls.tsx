import React, { createContext, useContext } from 'react';
import { isNil } from 'lodash';
import {
    IAllContestsUrlParams,
    IDownloadProblemResourceUrlParams, IGetSubmissionDetailsByIdUrlParams, IGetSubmissionResultsByProblemUrlParams,
    IStartContestParticipationUrlParams,
} from '../common/url-types';
import { IHaveChildrenProps } from '../components/common/Props';
import { FilterType } from '../common/contest-types';

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
const getAllContestsUrl = ({ filters }: IAllContestsUrlParams) => {
    let statusParams = filters.filter((f) => f.type === FilterType.Status);
    if (statusParams.length === 2) {
        statusParams = [];
    }

    const statusParam = statusParams.map(({ name }) => `filter=${name}`)
        .join('');

    return (
        isNil(statusParam)
            ? `${baseUrl}/Contests/GetAll`
            : `${baseUrl}/Contests/GetAll?${statusParam}`
    );
};
const getStartContestParticipationUrl = ({
    id,
    isOfficial,
}: IStartContestParticipationUrlParams) => `${baseUrl}/Compete/Index/${id}?official=${isOfficial}`;

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
const getSubmitUrl = () => `${baseUrl}/Compete/Submit`;

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
