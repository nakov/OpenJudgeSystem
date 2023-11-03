import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import isArray from 'lodash/isArray';

import { SearchParams } from '../common/search-types';
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
            const selectedTerms = [ 'Contests', 'Problems', 'Users' ];

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
