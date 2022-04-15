import React, { createContext, useContext } from 'react';
import { IStartContestUrlParams } from '../common/url-types';
import { IHaveChildrenProps } from '../components/common/Props';

interface IUrlsContext {
    getUrlForStartContestParticipation: (params: IStartContestUrlParams) => string;
}

const UrlsContext = createContext<IUrlsContext>({} as IUrlsContext);

interface IUrlsProviderProps extends IHaveChildrenProps {
}

const baseUrl = window.URLS.UI_URL;
const getUrlForStartContestParticipation =
    ({ id, official }: IStartContestUrlParams) => `${baseUrl}/Compete/Index/${id}?official=${official}`;

const UrlsProvider = ({ children }: IUrlsProviderProps) => {
    const value = { getUrlForStartContestParticipation };

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
