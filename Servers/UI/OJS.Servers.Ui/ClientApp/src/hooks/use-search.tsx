import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IUrlParam } from '../common/common-types';
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
        currentPage: number;
        pagesInfo: IPagesInfo;
    };
    actions: {
        changeSearchValue: (searchParam: string) => void;
        clearSearchValue: () => void;
        load: () => Promise<void>;
        changePage: (pageNumber: number) => void;
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
        searchValue: '',
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
    const [ searchValue, setSearchValue ] = useState<string>(defaultState.state.searchValue);
    const [ getSearchResultsUrlParams, setGetSearchResultsUrlParams ] = useState<IGetSearchResultsUrlParams>();

    const { getSearchResults } = useUrls();
    const { startLoading, stopLoading } = useLoading();
    const collectCurrentPage = (params: IUrlParam[]) => {
        const { value } = params.find((p) => p.key === PageParams.page) || { value: '1' };

        const theValue = isArray(value)
            ? value[0]
            : value;

        return parseInt(theValue, 10);
    };

    const {
        state: { params },
        actions: {
            setParam,
            unsetParam,
        },
    } = useUrlParams();

    const currentPage = useMemo(
        () => collectCurrentPage(params),
        [ params ],
    );

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

    const changePage = useCallback(
        (pageNumber: number) => {
            setParam(PageParams.page, pageNumber);
        },
        [ setParam ],
    );

    const setParams = useCallback(
        () => {
            if (isEmpty(searchValue) && !isEmpty(urlParam)) {
                setSearchValue(urlParam);
                const encodedUrl = encodeUrlToURIComponent(urlParam);
                setGetSearchResultsUrlParams({ page: currentPage, searchTerm: encodedUrl });
            } else if (!isEmpty(searchValue)) {
                const encodedUrl = encodeUrlToURIComponent(searchValue);
                setGetSearchResultsUrlParams({ page: currentPage, searchTerm: encodedUrl });
            }
        },
        [ currentPage, encodeUrlToURIComponent, searchValue, urlParam ],
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
                isLoaded: isSuccess,
                searchValue,
                pagesInfo,
                currentPage,
            },
            actions: {
                changeSearchValue,
                clearSearchValue,
                load,
                changePage,
                encodeUrlToURIComponent,
            },
        }),
        [ changePage, changeSearchValue, clearSearchValue, contests, currentPage, encodeUrlToURIComponent,
            isSuccess, load, pagesInfo, problems, searchValue, users, validationResult ],
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
