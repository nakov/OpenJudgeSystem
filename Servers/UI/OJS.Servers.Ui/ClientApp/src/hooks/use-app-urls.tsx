import React, { createContext, useContext, useMemo } from 'react';

import {
    IContestProblemUrl,
    IRegisterForContestTypeUrlParams,
} from '../common/app-url-types';
import { FilterType } from '../common/contest-types';
import { IHaveChildrenProps } from '../components/common/Props';

interface IAppUrlsContext {
    getRegisterContestTypeUrl: (params: IRegisterForContestTypeUrlParams) => string;
    getContestProblemUrl:(params: IContestProblemUrl) => string;
    getContestCategoryBreadcrumbItemPath: (id: string) => string;
    getAdministrationRetestSubmissionInternalUrl: () => string;
    getHomePageUrl: () => string;
    getLoginUrl: () => string;
}

const AppUrlsContext = createContext<IAppUrlsContext>({} as IAppUrlsContext);

type IAppUrlsProviderProps = IHaveChildrenProps

// contests
const getRegisterContestTypeUrl = ({
    id,
    participationType,
}: IRegisterForContestTypeUrlParams) => `/Contests/${id}/${participationType}`;

const getContestCategoryBreadcrumbItemPath = (id: string) => `/Contests?${FilterType.Category.toString()}=${id}`;

const getContestProblemUrl = ({
    id,
    participationType,
    orderBy,
}: IContestProblemUrl) => `/Contests/${id}/${participationType}#${orderBy}`;

const getAdministrationRetestSubmissionInternalUrl = () => '/Submissions/Retest';

const getHomePageUrl = () => '/';

const getLoginUrl = () => '/Login';

const AppUrlsProvider = ({ children }: IAppUrlsProviderProps) => {
    const value = useMemo(
        () => (
            {
                getRegisterContestTypeUrl,
                getContestProblemUrl,
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
