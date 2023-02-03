import React, { useCallback, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';

import { IProblemSearchType, IUserSearchType, SearchParams } from '../../common/search-types';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import List, { Orientation } from '../../components/guidelines/lists/List';
import SearchProblem from '../../components/search/search-problems/SearchProblems';
import SearchUser from '../../components/search/search-users/SearchUsers';
import { useUrlParams } from '../../hooks/common/use-url-params';
import { usePageTitles } from '../../hooks/use-page-titles';
import { useSearch } from '../../hooks/use-search';
import { setLayout } from '../shared/set-layout';

import styles from './SearchPage.module.scss';

const SearchPage = () => {
    const {
        state: {
            searchValue,
            contests,
            problems,
            users,
            validationResult,
            isLoaded,
            searchResultUrlParam,
        },
        actions: { load },
    } = useSearch();
    const { actions: { setPageTitle } } = usePageTitles();
    const { actions: { setParam } } = useUrlParams();

    useEffect(
        () => {
            if (isEmpty(searchResultUrlParam.searchTerm)) {
                return;
            }
            (async () => {
                await load();
            })();
        },
        [ load, searchResultUrlParam ],
    );

    useEffect(
        () => {
            if (isLoaded) {
                setPageTitle(`Search results for "${searchValue}"`);

                setParam(SearchParams.search, searchValue);
            }
        },
        [ isLoaded, searchValue, setPageTitle, setParam ],
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
                      type={HeadingType.small}
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
                      type={HeadingType.small}
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
                {renderProblems()}
                {renderUsers()}
            </>
        ),
        [ renderProblems, renderUsers, searchValue ],
    );

    const renderPage = useCallback(
        () => validationResult.isValid
            ? renderElements()
            : renderErrorMessage(),
        [ renderElements, renderErrorMessage, validationResult.isValid ],
    );

    console.log(problems);
    console.log(contests);
    console.log(users);
    console.log(validationResult.message);
    console.log(validationResult.isValid);
    return (
        renderPage()
    );
};
export default setLayout(SearchPage, true);
