import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import first from 'lodash/first';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IContestSearchType, IProblemSearchType, IUserSearchType, SearchParams } from '../common/search-types';
import { IPagedResultType, ISearchResponseModel } from '../common/types';
import { IGetSearchResultsUrlParams } from '../common/url-types';
import { IHaveChildrenProps } from '../components/common/Props';
import { getSearchResults } from '../utils/urls';

import { useUrlParams } from './common/use-url-params';
import { IErrorDataType, useHttp } from './use-http';
import { useLoading } from './use-loading';
import { usePages } from './use-pages';

interface ISearchContext {
    state: {
        contests: IContestSearchType[];
        problems: IProblemSearchType[];
        users: IUserSearchType[];
        isLoaded: boolean;
        searchValue: string;
        isVisible: boolean;
        searchError: IErrorDataType | null;
    };
    actions: {
        clearSearchValue: () => void;
        load: () => Promise<void>;
        initiateSearchResultsUrlQuery: () => void;
        toggleVisibility: () => void;
    };
}

type ISearchProviderProps = IHaveChildrenProps

const defaultState = {
    state: {
        contests: [] as IContestSearchType[],
        problems: [] as IProblemSearchType[],
        users: [] as IUserSearchType[],
        isVisible: false,
    },
};

const SearchContext = createContext<ISearchContext>(defaultState as ISearchContext);

const SearchProvider = ({ children }: ISearchProviderProps) => {
    const [ contests, setSearchedContests ] = useState(defaultState.state.contests);
    const [ problems, setSearchedProblems ] = useState(defaultState.state.problems);
    const [ users, setSearchedUsers ] = useState(defaultState.state.users);
    const [ searchError, setSearchError ] = useState<IErrorDataType | null>(null);
    const [ getSearchResultsUrlParams, setGetSearchResultsUrlParams ] = useState<IGetSearchResultsUrlParams | null>();
    const [ isVisible, setIsVisible ] = useState<boolean>(defaultState.state.isVisible);

    const {
        state: { params },
        actions: { unsetParam },
    } = useUrlParams();
    const {
        state: { currentPage },
        populatePageInformation,
    } = usePages();
    const { startLoading, stopLoading } = useLoading();

    const {
        get,
        data,
        error: getSearchResultError,
        isSuccess,
    } = useHttp<
        IGetSearchResultsUrlParams,
        IPagedResultType<ISearchResponseModel>>({
            url: getSearchResults,
            parameters: getSearchResultsUrlParams,
        });

    const urlParam = useMemo(
        () => {
            const { value } = params.find((p) => p.key === SearchParams.search) || { value: '' };

            return isArray(value)
                ? value[0]
                : value;
        },
        [ params ],
    );

    const encodeUrlToUTF8 = useMemo(
        () => encodeURIComponent(urlParam),
        [ urlParam ],
    );

    const urlTerms = useMemo(
        () => {
            const selectedTerms = [ 'Contests', 'Problems', 'Users' ];

            return params.filter(({ key, value }) => selectedTerms.includes(key) &&
                value === 'true') as [];
        },
        [ params ],
    );

    useEffect(
        () => {
            if (isNil(data) || isEmpty(data)) {
                return;
            }

            if (!isNil(getSearchResultError)) {
                setSearchError(getSearchResultError);

                return;
            }

            const searchResult = data as IPagedResultType<ISearchResponseModel>;
            const { items: searchResponseData } = searchResult;
            const {
                contests: searchedContests,
                problems: searchedProblems,
                users: searchedUsers,
            } = first(searchResponseData) as ISearchResponseModel;

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

            populatePageInformation(newPagesInfo);

            setSearchError(null);
        },
        [ data, getSearchResultError, populatePageInformation, searchError ],
    );

    const initiateSearchResultsUrlQuery = useCallback(
        () => {
            setGetSearchResultsUrlParams({
                searchTerm: encodeUrlToUTF8,
                page: currentPage,
                selectedTerms: urlTerms,
            });
        },
        [ currentPage, encodeUrlToUTF8, urlTerms ],
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
            if (isNil(getSearchResultsUrlParams)) {
                return;
            }

            (async () => {
                await load();
            })();
        },
        [ getSearchResultsUrlParams, load ],
    );

    const toggleVisibility = useCallback(
        () => {
            setIsVisible(!isVisible);
        },
        [ isVisible ],
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
                searchError,
                isLoaded: isSuccess,
                searchValue: urlParam,
                isVisible,
            },
            actions: {
                clearSearchValue,
                load,
                initiateSearchResultsUrlQuery,
                toggleVisibility,
            },
        }),
        [
            contests,
            problems,
            users,
            searchError,
            isSuccess,
            urlParam,
            isVisible,
            clearSearchValue,
            load,
            initiateSearchResultsUrlQuery,
            toggleVisibility,
        ],
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
