import React, { useCallback, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';

import { IContestSearchType, IProblemSearchType, IUserSearchType } from '../../common/search-types';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import List, { Orientation } from '../../components/guidelines/lists/List';
import PaginationControls from '../../components/guidelines/pagination/PaginationControls';
import ContestCard from '../../components/home-contests/contest-card/ContestCard';
import SearchProblem from '../../components/search/search-problems/SearchProblems';
import SearchUser from '../../components/search/search-users/SearchUsers';
import { useHashUrlParams } from '../../hooks/common/use-hash-url-params';
import { usePageTitles } from '../../hooks/use-page-titles';
import { useSearch } from '../../hooks/use-search';
import { setLayout } from '../shared/set-layout';

import styles from './SearchPage.module.scss';

const SearchPage = () => {
    const {
        state: {
            contests,
            problems,
            users,
            validationResult,
            searchValue,
            pagesInfo,
            currentPage,
            isLoaded,
        },
        actions: {
            load,
            changePage,
        },
    } = useSearch();
    const { actions: { setPageTitle } } = usePageTitles();
    const { state: { params }, actions: { clearHash } } = useHashUrlParams();

    useEffect(() => {
        if (!isEmpty(params)) {
            clearHash();
        }
    }, [ clearHash, params ]);

    useEffect(
        () => {
            if (isLoaded) {
                setPageTitle(`Search results for "${searchValue}"`);
            }
        },
        [ isLoaded, searchValue, setPageTitle ],
    );

    useEffect(
        () => {
            (async () => {
                await load();
            })();
        },
        [ load, searchValue ],
    );

    const handlePageChange = useCallback(
        (page: number) => changePage(page),
        [ changePage ],
    );

    const renderErrorMessage = useCallback(
        () => (
            <div className={styles.headingSearch}>
                <Heading
                  type={HeadingType.primary}
                  className={styles.searchHeading}
                >
                    {validationResult.message}
                </Heading>
            </div>
        ),
        [ validationResult ],
    );

    const renderContest = useCallback(
        (contest: IContestSearchType) => <ContestCard contest={contest} />,
        [],
    );

    const renderContests = useCallback(
        () => isEmpty(contests)
            ? null
            : (
                <>
                    <Heading
                      type={HeadingType.secondary}
                      className={styles.heading}
                    >
                        Contests:
                    </Heading>
                    <List
                      values={contests}
                      itemFunc={renderContest}
                      className={styles.items}
                      itemClassName={styles.contestItem}
                      orientation={Orientation.horizontal}
                      wrap
                    />
                </>
            ),
        [ contests, renderContest ],
    );

    const renderProblem = useCallback(
        (problem: IProblemSearchType) => <SearchProblem problem={problem} />,
        [],
    );

    const renderProblems = useCallback(
        () => isEmpty(problems)
            ? null
            : (
                <>
                    <Heading
                      type={HeadingType.secondary}
                      className={styles.heading}
                    >
                        Problems:
                    </Heading>
                    <List
                      values={problems}
                      itemFunc={renderProblem}
                      className={styles.items}
                      itemClassName={styles.contestItem}
                      orientation={Orientation.horizontal}
                      wrap
                    />
                </>
            ),
        [ problems, renderProblem ],
    );

    const renderUser = useCallback(
        (user: IUserSearchType) => <SearchUser user={user} />,
        [],
    );

    const renderUsers = useCallback(
        () => isEmpty(users)
            ? null
            : (
                <>
                    <Heading
                      type={HeadingType.secondary}
                      className={styles.heading}
                    >
                        Users:
                    </Heading>
                    <List
                      values={users}
                      itemFunc={renderUser}
                      className={styles.items}
                      itemClassName={styles.contestItem}
                      orientation={Orientation.horizontal}
                      wrap
                    />
                </>
            ),
        [ renderUser, users ],
    );

    const { pagesCount } = pagesInfo;
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
                <PaginationControls
                  count={pagesCount}
                  page={currentPage}
                  onChange={handlePageChange}
                />
                {renderContests()}
                {renderProblems()}
                {renderUsers()}
            </>
        ),
        [ currentPage, handlePageChange, pagesCount, renderContests, renderProblems, renderUsers, searchValue ],
    );

    const renderPage = useCallback(
        () => validationResult.isValid
            ? renderElements()
            : renderErrorMessage(),
        [ renderElements, renderErrorMessage, validationResult.isValid ],
    );

    return (
        renderPage()
    );
};
export default setLayout(SearchPage, true);
