import React, { createContext, useContext } from 'react';
import { isNil } from 'lodash';
import {
    IAllContestsUrlParams,
    IDownloadProblemResourceUrlParams, IGetCurrentSubmissionDetailsUrlParams, IGetSubmissionResultsByProblemUrlParams,
    IStartContestParticipationUrlParams,
    IStartContestUrlParams,
} from '../common/url-types';
import { IHaveChildrenProps } from '../components/common/Props';
import { FilterType } from '../common/contest-types';

interface IUrlsContext {
    getUrlForStartContestParticipation: (params: IStartContestUrlParams) => string;
    getUrlForAllContests: (params: IAllContestsUrlParams) => string;
    getStartContestParticipationUrl: (params: IStartContestParticipationUrlParams) => string;
    getDownloadProblemResourceUrl: (params: IDownloadProblemResourceUrlParams) => string;
    getGetSubmissionResultsByProblemUrl: (params: IGetSubmissionResultsByProblemUrlParams) => string;
    getGetIndexContestsUrl: string;
    getLoginSubmitUrl: string;
    getLogoutUrl: string;
    getProfileInfoUrl: string;
    getSubmissionDetailsUrl: string;
    getCurrentSubmissionDetailsUrl: (params: IGetCurrentSubmissionDetailsUrlParams) => string;
    getSubmissionsForProfileUrl: string;
    getParticipationsForProfileUrl: string;
    submitUrl: string;
    administrationContestsGridUrl: string;
}

const UrlsContext = createContext<IUrlsContext>({} as IUrlsContext);

interface IUrlsProviderProps extends IHaveChildrenProps {
}

const baseUrl = window.URLS.UI_URL;
const administrationBaseUrl = window.URLS.ADMINISTRATION_URL;

const getLoginSubmitUrl = `${baseUrl}/Account/Login`;
const getLogoutUrl = `${baseUrl}/Account/Logout`;

const getProfileInfoUrl = `${baseUrl}/Users/GetProfileInfo`;

const getSubmissionDetailsUrl = `${baseUrl}/Submissions/Details`;
const getCurrentSubmissionDetailsUrl =
    ({ submissionId }: IGetCurrentSubmissionDetailsUrlParams) => `${getSubmissionDetailsUrl}/${submissionId}`;
const getSubmissionsForProfileUrl = `${baseUrl}/Submissions/GetForProfile`;
const submitUrl = `${baseUrl}/Compete/Submit`;

const getParticipationsForProfileUrl = `${baseUrl}/Participations/GetForProfile`;

const administrationContestsGridUrl = `${administrationBaseUrl}/Contests`;

const getGetIndexContestsUrl = `${baseUrl}/Contests/GetForHomeIndex`;

const getUrlForStartContestParticipation =
    ({ id, official }: IStartContestUrlParams) => `${baseUrl}/Compete/Index/${id}?official=${official}`;

const getUrlForAllContests = ({ filters }: IAllContestsUrlParams) => {
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

const getGetSubmissionResultsByProblemUrl = ({
    id,
    isOfficial,
    take,
}: IGetSubmissionResultsByProblemUrlParams) => {
    const iurl = `${baseUrl}/Submissions/GetSubmissionResultsByProblem/${id}?isOfficial=${isOfficial}&take=${take}`;
    return iurl;
};

const getDownloadProblemResourceUrl = ({ id }: IDownloadProblemResourceUrlParams) => `${baseUrl}/ProblemResources/GetResource/${id}`;

const UrlsProvider = ({ children }: IUrlsProviderProps) => {
    const value = {
        getUrlForStartContestParticipation,
        getUrlForAllContests,
        getStartContestParticipationUrl,
        getDownloadProblemResourceUrl,
        getGetSubmissionResultsByProblemUrl,
        getGetIndexContestsUrl,
        getLoginSubmitUrl,
        getLogoutUrl,
        getProfileInfoUrl,
        getSubmissionDetailsUrl,
        getCurrentSubmissionDetailsUrl,
        getSubmissionsForProfileUrl,
        getParticipationsForProfileUrl,
        submitUrl,
        administrationContestsGridUrl,
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
