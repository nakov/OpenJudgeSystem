import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IContestSearchType, IProblemSearchType, IUserSearchType, SearchParams } from '../common/search-types';
import { ISearchResponseModel, IValidationType } from '../common/types';
import { IGetSearchResultsUrlParams } from '../common/url-types';
import { IHaveChildrenProps } from '../components/common/Props';

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
        searchValue: string;
        isLoaded: boolean;
        searchResultUrlParam: IGetSearchResultsUrlParams;
    };
    actions: {
        changeSearchValue: (searchParam: string) => void;
        clearSearchValue: () => void;
        load: () => Promise<void>;
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
        searchValue: '',
        searchResultUrlParam: { searchTerm: '' },
    },
};

const SearchContext = createContext<ISearchContext>(defaultState as ISearchContext);

const SearchProvider = ({ children }: ISearchProviderProps) => {
    const [ contests, setSearchedContests ] = useState(defaultState.state.contests);
    const [ problems, setSearchedProblems ] = useState(defaultState.state.problems);
    const [ users, setSearchedUsers ] = useState(defaultState.state.users);
    const [ validationResult, setValidationResult ] = useState<IValidationType>(defaultState.state.validationResult);
    const [ searchValue, setSearchValue ] = useState<string>(defaultState.state.searchValue);
    const [ getSearchResultsUrlParams, setGetSearchResultsUrlParams ] =
        useState<IGetSearchResultsUrlParams>(defaultState.state.searchResultUrlParam);

    const { getSearchResults } = useUrls();
    const { startLoading, stopLoading } = useLoading();
    const { search } = useLocation();

    const {
        actions: {
            setParam,
            unsetParam,
        },
    } = useUrlParams();

    const {
        get,
        data,
        isSuccess,
    } = useHttp<
        IGetSearchResultsUrlParams,
        ISearchResponseModel>({
            url: getSearchResults,
            parameters: getSearchResultsUrlParams,
        });

    const encodeUrlToURIComponent = useCallback(
        (url: string) => encodeURIComponent(url),
        [],
    );

    const urlParam = useMemo(
        () => {
            const query = new URLSearchParams(search);

            return query.get(SearchParams.search) as string;
        },
        [ search ],
    );

    const setParams = useCallback(
        () => {
            if (!isEmpty(urlParam) && isEmpty(searchValue)) {
                setGetSearchResultsUrlParams({ searchTerm: urlParam });
                setParam(SearchParams.search, urlParam);
                setSearchValue(urlParam);
            } else {
                const encodedUrl = encodeUrlToURIComponent(searchValue);
                setGetSearchResultsUrlParams({ searchTerm: encodedUrl });
            }
        },
        [ encodeUrlToURIComponent, searchValue, setParam, urlParam ],
    );

    useEffect(
        () => {
            setParams();
        },
        [ setParams ],
    );

    useEffect(
        () => {
            if (isNil(data) || isEmpty(data)) {
                return;
            }

            const {
                contests: searchedContests,
                problems: searchedProblems,
                users: searchedUsers,
                validationResult: newValidationResult,
            } = data as ISearchResponseModel;

            setSearchedContests(searchedContests);
            setSearchedProblems(searchedProblems);
            setSearchedUsers(searchedUsers);
            setValidationResult(newValidationResult);
        },
        [ data ],
    );

    const load = useCallback(
        async () => {
            startLoading();
            await get();
            stopLoading();
        },
        [ get, startLoading, stopLoading ],
    );

    const changeSearchValue = useCallback(
        (searchParam: string) => {
            setSearchValue(searchParam);
        },
        [],
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
                searchValue,
                isLoaded: isSuccess,
                searchResultUrlParam: getSearchResultsUrlParams,
            },
            actions: {
                changeSearchValue,
                clearSearchValue,
                load,
            },
        }),
        [ changeSearchValue, clearSearchValue, contests,
            getSearchResultsUrlParams, isSuccess, load, problems, searchValue, users, validationResult ],
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
