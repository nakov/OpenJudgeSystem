import React, { createContext, useContext } from 'react';
import { isNil } from 'lodash';
import { IAllContestsUrlParams, IStartContestUrlParams, IContestCategoriesUrlParams } from '../common/url-types';
import { IHaveChildrenProps } from '../components/common/Props';

interface IUrlsContext {
    getUrlForStartContestParticipation: (params: IStartContestUrlParams) => string;
    getUrlForAllContests: (params: IAllContestsUrlParams) => string;
    getUrlForCategoriesTree: () => string;
    getUrlForMainCategories: () => string;
    getUrlForSubcategories: (params: IContestCategoriesUrlParams) => string;
    getUrlForParentCategories: (params: IContestCategoriesUrlParams) => string;
    getUrlForAllContestStrategyFilter: () => string;
}

const UrlsContext = createContext<IUrlsContext>({} as IUrlsContext);

interface IUrlsProviderProps extends IHaveChildrenProps {
}

const baseUrl = window.URLS.UI_URL;

const getUrlForStartContestParticipation =
    ({ id, official }: IStartContestUrlParams) => `${baseUrl}/Compete/Index/${id}?official=${official}`;

const getUrlForAllContests = ({ filters, page }: IAllContestsUrlParams) => {
    const queryParams = filters
        .map(({ value, type }) => `${type.toLowerCase()}=${value}`)
        .join('&')
        + `&page=${page}`;

    return (
        isNil(queryParams)
            ? `${baseUrl}/Contests/GetAll`
            : `${baseUrl}/Contests/GetAll?${queryParams}`
    );
};

const getUrlForCategoriesTree =
    () => `${baseUrl}/ContestCategories/GetCategoriesTree`;

const getUrlForMainCategories =
    () => `${baseUrl}/ContestCategories/GetMainCategories`;

const getUrlForSubcategories =
    ({ id }: IContestCategoriesUrlParams) => `${baseUrl}/ContestCategories/GetSubcategories/${id}`;

const getUrlForParentCategories =
    ({ id }: IContestCategoriesUrlParams) => `${baseUrl}/ContestCategories/GetParentCategories/${id}`;

const getUrlForAllContestStrategyFilter =
    () => `${baseUrl}/SubmissionTypes/GetAll`;

const UrlsProvider = ({ children }: IUrlsProviderProps) => {
    const value = {
        getUrlForStartContestParticipation,
        getUrlForCategoriesTree,
        getUrlForAllContests,
        getUrlForMainCategories,
        getUrlForSubcategories,
        getUrlForParentCategories,
        getUrlForAllContestStrategyFilter,
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
