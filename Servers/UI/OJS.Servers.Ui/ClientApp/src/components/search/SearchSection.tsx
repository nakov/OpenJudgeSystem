import React, { useCallback, useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IContestSearchType, IProblemSearchType, IUserSearchType } from '../../common/search-types';
import {
    IPagedResultType,
    ISearchProps,
} from '../../common/types';
import { IGetSearchResultsParams } from '../../common/url-types';
import { IErrorDataType, useHttp } from '../../hooks/use-http';
import { useSearch } from '../../hooks/use-search';
import isNilOrEmpty from '../../utils/check-utils';
import { getSearchResultsUrl } from '../../utils/urls';
import Heading, { HeadingType } from '../guidelines/headings/Heading';
import List, { Orientation } from '../guidelines/lists/List';
import PaginationControls from '../guidelines/pagination/PaginationControls';

import styles from './SearchSection.module.scss';

type ISearchTypes = IUserSearchType | IContestSearchType | IProblemSearchType;

const SearchSection = <T extends ISearchTypes>({
    searchTerm,
    searchCategory,
    renderItem,
} : ISearchProps<T>) => {
    const { actions: { setSearchingError } } = useSearch();
    const [ isLoading, setIsLoading ] = useState(false);
    const [ searchedItems, setSearchedItems ] = useState([] as T[] || null);
    const [ searchResults, setSearchResults ] = useState({
        pageNumber: 1,
        itemsPerPage: 0,
        pagesCount: 0,
        totalItemsCount: 0,
    });
    const [ itemsSearchError, setItemsSearchError ] = useState<IErrorDataType | null>(null);
    const [ getSearchResultsParams, setGetSearchResultsParams ] =
    useState<IGetSearchResultsParams | null>();
    const [ currentItemsPage, setCurrentItemsPage ] = useState<number>(1);

    const {
        get: getItemSearchResults,
        data: itemSearchResultsData,
        error: getItemSearchResultsError,
    } = useHttp<IGetSearchResultsParams, IPagedResultType<T>>({
        url: getSearchResultsUrl,
        parameters: getSearchResultsParams,
    });

    const setQueryParams = useCallback(
        () => {
            setGetSearchResultsParams({
                searchTerm,
                page: currentItemsPage,
                searchCategory,
            });
        },
        [ currentItemsPage, searchCategory, searchTerm ],
    );

    useEffect(() => {
        setQueryParams();
    }, [ setQueryParams, searchTerm, currentItemsPage ]);

    useEffect(() => {
        if (isNil(getSearchResultsParams)) {
            return;
        }

        setIsLoading(true);
        setItemsSearchError(null);
        getItemSearchResults();
    }, [ getSearchResultsParams, getItemSearchResults ]);

    useEffect(() => {
        if (!isNilOrEmpty(itemSearchResultsData)) {
            setIsLoading(false);
        }
    }, [ itemSearchResultsData ]);

    useEffect(() => {
        if (isNilOrEmpty(itemSearchResultsData)) {
            return;
        }

        if (!isNil(getItemSearchResultsError)) {
            setItemsSearchError(getItemSearchResultsError);
            setSearchingError(getItemSearchResultsError);

            return;
        }

        const searchResult = itemSearchResultsData as IPagedResultType<T>;

        const { items: searchResponseData } = searchResult;

        if (isNil(searchResponseData) || isEmpty(searchResponseData)) {
            setSearchedItems([]);
            return;
        }

        setSearchedItems(searchResponseData);
        setItemsSearchError(null);
        setSearchingError(null);
        setSearchResults(searchResult);
    }, [ getItemSearchResultsError, itemSearchResultsData, searchCategory, searchResults,
        searchedItems, setSearchingError ]);

    const handlePageChange = useCallback((newPage: number) => {
        setCurrentItemsPage(newPage);
    }, []);

    const renderNoResultsFound = useCallback(
        () => (
            <div className={styles.headingSearch}>
                <Heading
                  type={HeadingType.secondary}
                  className={styles.heading}
                >
                    {searchCategory}
                    :
                </Heading>
                <Heading
                  type={HeadingType.secondary}
                  className={styles.searchHeading}
                >
                    No results found for
                    {' '}
                    {searchCategory.toLowerCase()}
                </Heading>
            </div>
        ),
        [ searchCategory ],
    );

    const renderItems = useCallback(
        (items: T[]) => (
            <>
                <Heading
                  type={HeadingType.secondary}
                  className={styles.heading}
                >
                    {searchCategory}
                    :
                </Heading>
                <List
                  values={items}
                  itemFunc={renderItem}
                  className={styles.items}
                  itemClassName={styles.contestItem}
                  orientation={Orientation.horizontal}
                  wrap
                />
                <PaginationControls
                  count={searchResults.pagesCount}
                  page={currentItemsPage}
                  onChange={handlePageChange}
                />
            </>
        ),
        [ searchResults, currentItemsPage, handlePageChange, renderItem, searchCategory ],
    );

    return (
        isNil(itemsSearchError) && !isLoading
            ? isEmpty(searchedItems)
                ? renderNoResultsFound()
                : renderItems(searchedItems)
            : null
    );
};

export default SearchSection;
