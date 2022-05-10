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
    const queryParams = filters
        .map(({ name, type }) => {
            if (type == FilterType.Status) {
                return `status=${name}`;
            }

            return `strategy=${name}`;
        })
        .join('&');

    return (
        isNil(queryParams)
            ? `${baseUrl}/Contests/GetAll`
            : `${baseUrl}/Contests/GetAll?${queryParams}`
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
