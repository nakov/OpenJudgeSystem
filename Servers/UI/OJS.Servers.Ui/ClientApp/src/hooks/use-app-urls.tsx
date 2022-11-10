import React, { createContext, useContext, useMemo } from 'react';

import {
    IRegisterForContestTypeUrlParams,
} from '../common/app-url-types';
import { IHaveChildrenProps } from '../components/common/Props';

interface IAppUrlsContext {
    getRegisterContestTypeUrl: (params: IRegisterForContestTypeUrlParams) => string;
}

const AppUrlsContext = createContext<IAppUrlsContext>({} as IAppUrlsContext);

type IAppUrlsProviderProps = IHaveChildrenProps

// contests
const getRegisterContestTypeUrl = ({
    id,
    participationType,
}: IRegisterForContestTypeUrlParams) => `/Contests/${id}/Register/${participationType}`;

const AppUrlsProvider = ({ children }: IAppUrlsProviderProps) => {
    const value = useMemo(
        () => ({ getRegisterContestTypeUrl }),
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
