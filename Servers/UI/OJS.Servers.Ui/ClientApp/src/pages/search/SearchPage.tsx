/* eslint-disable max-len */
import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { CheckboxSearchValues } from '../../common/enums';
import {
    IIndexContestsType,
    IPagedResultType,
    IProblemSearchType,
    IUSerSearchCardProps,
    IUserType,
} from '../../common/types';
import ContestCard from '../../components/contests/contest-card/ContestCard';
import List, { Orientation } from '../../components/guidelines/lists/List';
import PaginationControls from '../../components/guidelines/pagination/PaginationControls';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import ProblemSearchCard from '../../components/search/profile-search-card/ProblemSearchCard';
import UserSearchCard from '../../components/search/user-search-card/UserSearchCard';
import useTheme from '../../hooks/use-theme';
import {
    useLazyGetContestsSearchQuery,
    useLazyGetProblemsSearchQuery,
    useLazyGetUsersSearchQuery,
} from '../../redux/services/searchService';
import { useAppSelector } from '../../redux/store';

import styles from './SearchPage.module.scss';

enum SearchTypeEnums {
    CONTESTS = 'Contests',
    PROBLEMS = 'Problems',
    USERS = 'Users',
}

const SearchPage = () => {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const { getColorClassName, themeColors } = useTheme();
    const { searchValue, selectedTerms } = useAppSelector((state) => state.search);

    const textColorClassName = getColorClassName(themeColors.textColor);

    const [
        getContestsSearch, {
            data: contestsSearchData,
            isLoading: contestsSearchLoading,
            isError: contestsSearchError,
        } ] = useLazyGetContestsSearchQuery();
    const [
        getProblemsSearch, {
            data: problemsSearchData,
            isLoading: problemsSearchLoading,
            isError: problemsSearchError,
        } ] = useLazyGetProblemsSearchQuery();
    const [
        getUsersSearch, {
            data: usersSearchData,
            isLoading: usersSearchLoading,
            isError: usersSearchError,
        },
    ] = useLazyGetUsersSearchQuery();

    const selectedContestsPage = useMemo(() => {
        if (!searchParams.get('contestsPage')) {
            return 1;
        }
        return Number(searchParams.get('contestsPage'));
    }, [ searchParams ]);

    const selectedProblemsPage = useMemo(() => {
        if (!searchParams.get('problemsPage')) {
            return 1;
        }
        return Number(searchParams.get('problemsPage'));
    }, [ searchParams ]);

    const selectedUsersPage = useMemo(() => {
        if (!searchParams.get('usersPage')) {
            return 1;
        }
        return Number(searchParams.get('usersPage'));
    }, [ searchParams ]);

    // initiate the search
    useEffect(() => {
        if (searchValue.length < 3 || selectedTerms.length === 0) {
            return;
        }
        if (selectedTerms.includes(CheckboxSearchValues.problems)) {
            getProblemsSearch({ searchTerm: searchValue, page: selectedProblemsPage });
        }
        if (selectedTerms.includes(CheckboxSearchValues.contests)) {
            getContestsSearch({ searchTerm: searchValue, page: selectedContestsPage });
        }
        if (selectedTerms.includes(CheckboxSearchValues.users)) {
            getUsersSearch({ searchTerm: searchValue, page: selectedUsersPage });
        }
    }, [
        searchValue,
        selectedTerms,
        selectedContestsPage,
        selectedProblemsPage,
        selectedUsersPage,
        getProblemsSearch,
        getContestsSearch,
        getUsersSearch,
    ]);

    const renderSearchFragmentResults = useCallback((
        searchName: SearchTypeEnums,
        data: IPagedResultType<IIndexContestsType> | IPagedResultType<IUserType> | IPagedResultType<IProblemSearchType> | undefined,
        isLoading: boolean,
        error: boolean,
    ) => {
        const renderErrorFragment = () => (
            <div>
                Error fetching
                {' '}
                {searchName}
            </div>
        );

        const renderData = () => {
            const renderFunction = (renderElement: any) => {
                if (searchName === SearchTypeEnums.CONTESTS) {
                    return <ContestCard contest={(renderElement as IIndexContestsType)} />;
                } if (searchName === SearchTypeEnums.PROBLEMS) {
                    return <ProblemSearchCard problem={(renderElement as IProblemSearchType)} />;
                }
                return <UserSearchCard user={renderElement as IUSerSearchCardProps} />;
            };

            const selectedPageValue = () => {
                if (searchName === SearchTypeEnums.CONTESTS) {
                    return selectedContestsPage;
                } if (searchName === SearchTypeEnums.PROBLEMS) {
                    return selectedProblemsPage;
                }
                return selectedUsersPage;
            };

            return (
                <div className={styles.searchResultsWrapper}>
                    {!data || data.totalItemsCount === 0
                        ? <div>No items found</div>
                        : (
                            <>
                                <List
                                  values={data.items}
                                  itemFunc={renderFunction}
                                  orientation={searchName === SearchTypeEnums.USERS
                                      ? Orientation.horizontal
                                      : Orientation.vertical}
                                />
                                <PaginationControls
                                  count={data?.pagesCount}
                                  page={selectedPageValue()}
                                  onChange={(page: number) => {
                                      searchParams.set(`${searchName.toLowerCase()}Page`, page.toString());
                                      setSearchParams(searchParams);
                                  }}
                                />
                            </>
                        )}
                    { searchName !== SearchTypeEnums.USERS && (<hr className={styles.line} />)}
                </div>
            );
        };

        if (isLoading) {
            return <SpinningLoader />;
        }

        return (
            <div>
                <div className={styles.searchSectionHeader}>
                    {searchName}
                </div>
                { error
                    ? renderErrorFragment()
                    : renderData()}
            </div>
        );
    }, [ searchParams, selectedContestsPage, selectedProblemsPage, selectedUsersPage, setSearchParams ]);

    return (
        <div className={`${styles.searchPageWrapper} ${textColorClassName}`}>
            {searchValue.length < 3
                ? <div>The search term must be at least 3 characters!</div>
                : (
                    <>
                        <div className={styles.searchTextHeader}>
                            Search results for &quot;
                            {searchValue}
                            &quot;
                        </div>
                        {renderSearchFragmentResults(SearchTypeEnums.CONTESTS, contestsSearchData, contestsSearchLoading, contestsSearchError)}
                        {renderSearchFragmentResults(SearchTypeEnums.PROBLEMS, problemsSearchData, problemsSearchLoading, problemsSearchError)}
                        {renderSearchFragmentResults(SearchTypeEnums.USERS, usersSearchData, usersSearchLoading, usersSearchError)}
                    </>
                )}
        </div>
    );
};

export default SearchPage;
