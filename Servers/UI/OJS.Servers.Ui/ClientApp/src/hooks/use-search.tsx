import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { PageParams } from '../common/pages-types';
import { IContestSearchType, IProblemSearchType, IUserSearchType, SearchParams } from '../common/search-types';
import { IPagedResultType, ISearchResponseModel, IValidationType } from '../common/types';
import { IGetSearchResultsUrlParams } from '../common/url-types';
import { IHaveChildrenProps, IPagesInfo } from '../components/common/Props';

import { useUrlParams } from './common/use-url-params';
import { useHttp } from './use-http';
import { useLoading } from './use-loading';
import { useUrls } from './use-urls';

interface ISearchContext {
    state: {
        contests: IContestSearchType[];
        problems: IProblemSearchType[];
        users: IUserSearchType[];
        validationResult: IValidationType;
        isLoaded: boolean;
        searchValue: string;
        pagesInfo: IPagesInfo;
    };
    actions: {
        clearSearchValue: () => void;
        load: () => Promise<void>;
        initiateSearchResultsUrlQuery: () => void;
        encodeUrlToURIComponent: (url: string) => string;
    };
}

type ISearchProviderProps = IHaveChildrenProps

const defaultState = {
    state: {
        contests: [] as IContestSearchType[],
        problems: [] as IProblemSearchType[],
        users: [] as IUserSearchType[],
        validationResult: {
            message: '',
            isValid: true,
            propertyName: '',
        },
        pagesInfo: { pageNumber: 1 },
    },
};

const SearchContext = createContext<ISearchContext>(defaultState as ISearchContext);

const SearchProvider = ({ children }: ISearchProviderProps) => {
    const [ contests, setSearchedContests ] = useState(defaultState.state.contests);
    const [ problems, setSearchedProblems ] = useState(defaultState.state.problems);
    const [ users, setSearchedUsers ] = useState(defaultState.state.users);
    const [ validationResult, setValidationResult ] = useState<IValidationType>(defaultState.state.validationResult);
    const [ pagesInfo, setPagesInfo ] = useState<IPagesInfo>(defaultState.state.pagesInfo as IPagesInfo);
    const [ getSearchResultsUrlParams, setGetSearchResultsUrlParams ] = useState<IGetSearchResultsUrlParams | null>();

    const { getSearchResults } = useUrls();
    const { state: { params }, actions: { unsetParam } } = useUrlParams();
    const { startLoading, stopLoading } = useLoading();

    const {
        get,
        data,
        isSuccess,
    } = useHttp<
        IGetSearchResultsUrlParams,
        IPagedResultType<ISearchResponseModel>>({
            url: getSearchResults,
            parameters: getSearchResultsUrlParams,
        });

    const encodeUrlToURIComponent = useCallback(
        (url: string) => encodeURIComponent(url),
        [],
    );

    const urlParam = useMemo(
        () => {
            const { value } = params.find((p) => p.key === SearchParams.search) || { value: '' };

            return isArray(value)
                ? value[0]
                : value;
        },
        [ params ],
    );

    useEffect(
        () => {
            if (isNil(data) || isEmpty(data)) {
                return;
            }

            const searchResult = data as IPagedResultType<ISearchResponseModel>;
            const newData = searchResult.items as ISearchResponseModel[];
            const {
                contests: searchedContests,
                problems: searchedProblems,
                users: searchedUsers,
                validationResult: newValidationResult,
            } = newData[0];

            const {
                pageNumber,
                itemsPerPage,
                pagesCount,
                totalItemsCount,
            } = searchResult || {};

            const newPagesInfo = {
                pageNumber,
                itemsPerPage,
                pagesCount,
                totalItemsCount,
            };

            setSearchedContests(searchedContests);
            setSearchedProblems(searchedProblems);
            setSearchedUsers(searchedUsers);
            setValidationResult(newValidationResult);
            setPagesInfo(newPagesInfo);
        },
        [ data ],
    );

    const collectCurrentPage = useCallback(
        () => {
            const { value } = params.find((p) => p.key === PageParams.page) || { value: '1' };

            const theValue = isArray(value)
                ? value[0]
                : value;

            return parseInt(theValue, 10);
        },
        [ params ],
    );

    const initiateSearchResultsUrlQuery = useCallback(
        () => {
            setGetSearchResultsUrlParams({ searchTerm: encodeUrlToURIComponent(urlParam), page: collectCurrentPage() });
        },
        [ collectCurrentPage, encodeUrlToURIComponent, urlParam ],
    );

    const load = useCallback(
        async () => {
            startLoading();
            await get();
            stopLoading();
        },
        [ get, startLoading, stopLoading ],
    );

    useEffect(
        () => {
            if (isNil(getSearchResults)) {
                return;
            }

            (async () => {
                await load();
            })();
        },
        [ getSearchResults, load ],
    );

    const clearSearchValue = useCallback(
        () => unsetParam(SearchParams.search),
        [ unsetParam ],
    );

    const value = useMemo(
        () => ({
            state: {
                contests,
                problems,
                users,
                validationResult,
                isLoaded: isSuccess,
                searchValue: urlParam,
                pagesInfo,
            },
            actions: {
                clearSearchValue,
                load,
                encodeUrlToURIComponent,
                initiateSearchResultsUrlQuery,
            },
        }),
        [ clearSearchValue, contests, encodeUrlToURIComponent, isSuccess, load,
            pagesInfo, problems, urlParam, users, validationResult, initiateSearchResultsUrlQuery ],
    );

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};

const useSearch = () => useContext(SearchContext);

export default SearchProvider;

export {
    useSearch,
};
