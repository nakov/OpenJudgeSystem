import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IContestSearchType, IProblemSearchType, IUserSearchType, SearchParams } from '../common/search-types';
import { IPagedResultType, ISearchResponseModel, IValidationType } from '../common/types';
import { IGetSearchResultsUrlParams } from '../common/url-types';
import { IHaveChildrenProps } from '../components/common/Props';

import { useUrlParams } from './common/use-url-params';
import { useHttp } from './use-http';
import { useLoading } from './use-loading';
import { usePages } from './use-pages';
import { useUrls } from './use-urls';

interface ISearchContext {
    state: {
        contests: IContestSearchType[];
        problems: IProblemSearchType[];
        users: IUserSearchType[];
        validationResult: IValidationType;
        isLoaded: boolean;
        searchValue: string;
        isVisible: boolean;
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
        validationResult: {
            message: '',
            isValid: true,
            propertyName: '',
        },
        isVisible: false,
    },
};

const SearchContext = createContext<ISearchContext>(defaultState as ISearchContext);

const SearchProvider = ({ children }: ISearchProviderProps) => {
    const [ contests, setSearchedContests ] = useState(defaultState.state.contests);
    const [ problems, setSearchedProblems ] = useState(defaultState.state.problems);
    const [ users, setSearchedUsers ] = useState(defaultState.state.users);
    const [ validationResult, setValidationResult ] = useState<IValidationType>(defaultState.state.validationResult);
    const [ getSearchResultsUrlParams, setGetSearchResultsUrlParams ] = useState<IGetSearchResultsUrlParams | null>();
    const [ isVisible, setIsVisible ] = useState<boolean>(defaultState.state.isVisible);

    const { getSearchResults } = useUrls();
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

    const urlTerm = useMemo(
        () => {
            const { value } = params.find((p) => p.key === SearchParams.selectedTerm) || { value: 'All' };

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

            populatePageInformation(newPagesInfo);
        },
        [ data, populatePageInformation ],
    );

    const initiateSearchResultsUrlQuery = useCallback(
        () => {
            setGetSearchResultsUrlParams({
                searchTerm: encodeUrlToURIComponent(urlParam),
                page: currentPage,
                selectedTerm: urlTerm,
            });
        },
        [ currentPage, encodeUrlToURIComponent, urlTerm, urlParam ],
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
                validationResult,
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
            validationResult,
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
