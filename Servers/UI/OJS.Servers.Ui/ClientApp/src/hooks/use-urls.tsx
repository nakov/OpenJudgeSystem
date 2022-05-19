import React, { createContext, useContext } from 'react';
import { isNil } from 'lodash';
import { IAllContestsUrlParams, IStartContestUrlParams } from '../common/url-types';
import { IHaveChildrenProps } from '../components/common/Props';
import { FilterType } from '../common/contest-types';

interface IUrlsContext {
    getUrlForStartContestParticipation: (params: IStartContestUrlParams) => string;
    getUrlForAllContests: (params: IAllContestsUrlParams) => string;
}

const UrlsContext = createContext<IUrlsContext>({} as IUrlsContext);

interface IUrlsProviderProps extends IHaveChildrenProps {
}

const baseUrl = window.URLS.UI_URL;

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

const UrlsProvider = ({ children }: IUrlsProviderProps) => {
    const value = {
        getUrlForStartContestParticipation,
        getUrlForAllContests,
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
