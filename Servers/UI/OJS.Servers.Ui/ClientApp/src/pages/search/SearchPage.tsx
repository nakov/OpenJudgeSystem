import React, { useCallback, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { NotSelectedSearchCategoryMessage } from '../../common/constants';
import { IContestSearchType, IProblemSearchType, IUserSearchType, SearchCategory } from '../../common/search-types';
import { IIndexContestsType } from '../../common/types';
import ContestCard from '../../components/contests/contest-card/ContestCard';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import SearchProblem from '../../components/search/search-problems/SearchProblem';
import SearchUser from '../../components/search/search-users/SearchUser';
import SearchSection from '../../components/search/SearchSection';
import { usePageTitles } from '../../hooks/use-page-titles';
import { useSearch } from '../../hooks/use-search';
import { setLayout } from '../shared/set-layout';

import styles from './SearchPage.module.scss';

const SearchPage = () => {
    const {
        state: {
            searchError,
            searchValue,
            getSearchResultsUrlParams,
            isSearchingUsers,
            isSearchingProblems,
            isSearchingContests,
        },
        actions: {
            initiateSearchResultsUrlQuery,
            setSearchingError,
        },
    } = useSearch();
    const { actions: { setPageTitle } } = usePageTitles();

    useEffect(
        () => {
            setSearchingError(null);
            initiateSearchResultsUrlQuery();
        },
        [ getSearchResultsUrlParams?.searchTerm, initiateSearchResultsUrlQuery, setSearchingError ],
    );

    useEffect(
        () => {
            setPageTitle(`Search results for "${searchValue}"`);
        },
        [ searchValue, setPageTitle ],
    );

    const renderErrorHeading = useCallback(
        (message: string) => (
            <div className={styles.headingSearch}>
                <Heading
                  type={HeadingType.primary}
                  className={styles.searchHeading}
                >
                    {message}
                    {' '}
                </Heading>
            </div>
        ),
        [],
    );

    const renderErrorMessage = useCallback(
        () => {
            if (!isNil(searchError)) {
                const { detail } = searchError;
                return renderErrorHeading(detail);
            }

            return null;
        },
        [ renderErrorHeading, searchError ],
    );

    const renderContest = useCallback(
        (contest: IContestSearchType) => <ContestCard contest={(contest as IIndexContestsType)} />,
        [],
    );

    const renderProblem = useCallback(
        (problem: IProblemSearchType) => <SearchProblem problem={problem} />,
        [],
    );

    const renderUser = useCallback(
        (user: IUserSearchType) => <SearchUser user={user} />,
        [],
    );

    const renderElements = useCallback(
        () => (
            <>
                <div className={styles.headingSearch}>
                    <Heading
                      type={HeadingType.primary}
                      className={styles.searchHeading}
                    >
                        Search results for
                        {' '}
                        {`"${searchValue}"`}
                    </Heading>
                </div>
                {isSearchingContests &&
                    (
                    <SearchSection<IContestSearchType>
                      searchTerm={getSearchResultsUrlParams?.searchTerm ?? ''}
                      searchCategory={SearchCategory.Contest}
                      renderItem={renderContest}
                    />
                    )}
                {isSearchingProblems &&
                    (
                    <SearchSection<IProblemSearchType>
                      searchTerm={getSearchResultsUrlParams?.searchTerm ?? ''}
                      searchCategory={SearchCategory.Problem}
                      renderItem={renderProblem}
                    />
                    )}
                {isSearchingUsers &&
                    (
                    <SearchSection<IUserSearchType>
                      searchTerm={getSearchResultsUrlParams?.searchTerm ?? ''}
                      searchCategory={SearchCategory.User}
                      renderItem={renderUser}
                    />
                    )}
            </>
        ),
        [ searchValue, isSearchingContests, getSearchResultsUrlParams?.searchTerm, renderContest,
            isSearchingProblems, renderProblem, isSearchingUsers, renderUser ],
    );

    const renderPage = useCallback(
        () => isNil(searchError)
            ? isEmpty(getSearchResultsUrlParams?.selectedTerms)
                ? renderErrorHeading(NotSelectedSearchCategoryMessage)
                : renderElements()
            : renderErrorMessage(),
        [ getSearchResultsUrlParams?.selectedTerms, renderElements,
            renderErrorHeading, renderErrorMessage, searchError ],
    );

    return (
        renderPage()
    );
};
export default setLayout(SearchPage, true);
