import React, { createContext, useContext, useMemo } from 'react';

import {
    IContestProblemUrl,
    IContestResultsUrl,
    IParticipateInContestTypeUrlParams,
} from '../common/app-url-types';
import { ContestResultType } from '../common/constants';
import { FilterType } from '../common/contest-types';
import { IHaveChildrenProps } from '../components/common/Props';

interface IAppUrlsContext {
    getParticipateInContestUrl: (params: IParticipateInContestTypeUrlParams) => string;
    getContestProblemUrl:(params: IContestProblemUrl) => string;
    getContestCategoryBreadcrumbItemPath: (id: string) => string;
    getContestResultsUrl: (params: IContestResultsUrl) => string;
    getAdministrationRetestSubmissionInternalUrl: () => string;
    getHomePageUrl: () => string;
    getLoginUrl: () => string;
}

const AppUrlsContext = createContext<IAppUrlsContext>({} as IAppUrlsContext);

type IAppUrlsProviderProps = IHaveChildrenProps

// contests
const getParticipateInContestUrl = ({
    id,
    participationType,
    problemIndex,
}: IParticipateInContestTypeUrlParams) => `/contests/${id}/${participationType}#${problemIndex}`;

const getContestCategoryBreadcrumbItemPath = (id: string) => `/Contests?${FilterType.Category.toString()}=${id}`;

const getContestProblemUrl = ({
    id,
    participationType,
    orderBy,
}: IContestProblemUrl) => `/Contests/${id}/${participationType}#${orderBy}`;

const getContestResultsUrl = ({
    id,
    participationType,
}: IContestResultsUrl) => `/contests/${id}/${participationType}/results/${ContestResultType.Simple}`;

const getAdministrationRetestSubmissionInternalUrl = () => '/Submissions/Retest';

const getHomePageUrl = () => '/';

const getLoginUrl = () => '/Login';

const AppUrlsProvider = ({ children }: IAppUrlsProviderProps) => {
    const value = useMemo(
        () => (
            {
                getParticipateInContestUrl,
                getContestProblemUrl,
                getContestResultsUrl,
                getContestCategoryBreadcrumbItemPath,
                getAdministrationRetestSubmissionInternalUrl,
                getHomePageUrl,
                getLoginUrl,
            }
        ),
        [],
    );

    return (
        <AppUrlsContext.Provider value={value}>
            {children}
        </AppUrlsContext.Provider>
    );
};

const useAppUrls = () => useContext(AppUrlsContext);

export default AppUrlsProvider;

export {
    useAppUrls,
};
