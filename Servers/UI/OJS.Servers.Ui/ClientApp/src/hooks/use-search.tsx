import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { SearchCategory, SearchParams } from '../common/search-types';
import { IGetSearchResultsUrlParams } from '../common/url-types';
import { IHaveChildrenProps } from '../components/common/Props';

import { useUrlParams } from './common/use-url-params';
import { IErrorDataType } from './use-http';

interface ISearchContext {
    state: {
        getSearchResultsUrlParams: IGetSearchResultsUrlParams | null | undefined;
        searchValue: string;
        isVisible: boolean;
        searchError: IErrorDataType | null;
        isSearchingContests: boolean;
        isSearchingProblems: boolean;
        isSearchingUsers: boolean;
    };
    actions: {
        clearSearchValue: () => void;
        initiateSearchResultsUrlQuery: () => void;
        toggleVisibility: () => void;
        setSearchingError: (error: IErrorDataType | null) => void;
    };
}

type ISearchProviderProps = IHaveChildrenProps

const defaultState = { state: { isVisible: false } };

const SearchContext = createContext<ISearchContext>(defaultState as ISearchContext);

const SearchProvider = ({ children }: ISearchProviderProps) => {
    const [ searchError, setSearchError ] = useState<IErrorDataType | null>(null);
    const [ getSearchResultsUrlParams, setGetSearchResultsUrlParams ] = useState<IGetSearchResultsUrlParams | null>();
    const [ isVisible, setIsVisible ] = useState<boolean>(defaultState.state.isVisible);
    const [ isSearchingContests, setIsSearchingContests ] = useState(false);
    const [ isSearchingProblems, setIsSearchingProblems ] = useState(false);
    const [ isSearchingUsers, setIsSearchingUsers ] = useState(false);

    const {
        state: { params },
        actions: { unsetParam },
    } = useUrlParams();

    const setSearchingError = useCallback((error: IErrorDataType | null) => {
        setSearchError(error);
    }, []);

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
            const selectedTerms = [ SearchCategory.Contest.valueOf(), SearchCategory.Problem.valueOf(), SearchCategory.User.valueOf() ];

            return params.filter(({ key, value }) => selectedTerms.includes(key) &&
                value === 'true') as [];
        },
        [ params ],
    );

    const initiateSearchResultsUrlQuery = useCallback(
        () => {
            setGetSearchResultsUrlParams({
                searchTerm: encodeUrlToUTF8,
                selectedTerms: urlTerms,
            });
        },
        [ encodeUrlToUTF8, urlTerms ],
    );

    useEffect(
        () => {
            if (isNil(getSearchResultsUrlParams)) {
                return;
            }

            setIsSearchingUsers(false);
            setIsSearchingProblems(false);
            setIsSearchingContests(false);

            const isProblemsCategoryInUrl = !isEmpty(getSearchResultsUrlParams?.selectedTerms
                .filter(({ key }) => key === SearchCategory.Problem));
            const isContestsCategoryInUrl = !isEmpty(getSearchResultsUrlParams?.selectedTerms
                .filter(({ key }) => key === SearchCategory.Contest));
            const isUsersCategoryInUrl = !isEmpty(getSearchResultsUrlParams?.selectedTerms
                .filter(({ key }) => key === SearchCategory.User));

            if (isProblemsCategoryInUrl) {
                setIsSearchingProblems(true);
            }

            if (isContestsCategoryInUrl) {
                setIsSearchingContests(true);
            }

            if (isUsersCategoryInUrl) {
                setIsSearchingUsers(true);
            }
        },
        [ getSearchResultsUrlParams, initiateSearchResultsUrlQuery, urlTerms ],
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
                searchError,
                searchValue: urlParam,
                isVisible,
                getSearchResultsUrlParams,
                isSearchingUsers,
                isSearchingProblems,
                isSearchingContests,
            },
            actions: {
                clearSearchValue,
                initiateSearchResultsUrlQuery,
                toggleVisibility,
                setSearchingError,
            },
        }),
        [
            getSearchResultsUrlParams,
            searchError,
            urlParam,
            isVisible,
            clearSearchValue,
            initiateSearchResultsUrlQuery,
            setSearchingError,
            toggleVisibility,
            isSearchingUsers,
            isSearchingProblems,
            isSearchingContests,
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
