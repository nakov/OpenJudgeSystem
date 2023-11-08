import React, { useCallback, useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { ContestStatus, FilterType, IFilter, SortType } from '../../common/contest-types';
import { PageParams } from '../../common/pages-types';
import { IIndexContestsType } from '../../common/types';
import ContestBreadcrumb from '../../components/contests/contest-breadcrumb/ContestBreadcrumb';
import ContestFilters from '../../components/contests/contests-filters/ContestFilters';
import { Alert, AlertHorizontalOrientation, AlertSeverity, AlertVariant, AlertVerticalOrientation } from '../../components/guidelines/alert/Alert';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import List, { Orientation } from '../../components/guidelines/lists/List';
import PaginationControls from '../../components/guidelines/pagination/PaginationControls';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import ContestCard from '../../components/home-contests/contest-card/ContestCard';
import { useUrlParams } from '../../hooks/common/use-url-params';
import { useContestCategories } from '../../hooks/use-contest-categories';
import { useContestStrategyFilters } from '../../hooks/use-contest-strategy-filters';
import { useContests } from '../../hooks/use-contests';
import { usePages } from '../../hooks/use-pages';
import { flexCenterObjectStyles } from '../../utils/object-utils';
import { toLowerCase } from '../../utils/string-utils';
import { setLayout } from '../shared/set-layout';

import styles from './ContestsPage.module.scss';

const ContestsPage = () => {
    const {
        state: {
            contests,
            isLoaded,
            contestsAreLoading,
        },
        actions: {
            toggleParam,
            initiateGetAllContestsQuery,
        },
    } = useContests();
    const {
        state: { currentPage, pagesInfo },
        changePage,
    } = usePages();
    const { state: { categoriesFlat }, actions: { load: loadCategories } } = useContestCategories();
    const { state: params, actions: { clearParams } } = useUrlParams();
    const { state: { strategies }, actions: { load: loadStrategies } } = useContestStrategyFilters();
    const [ showAlert, setShowAlert ] = useState<boolean>(false);

    useEffect(
        () => {
            if (isEmpty(categoriesFlat)) {
                (async () => {
                    await loadCategories();
                })();
            }

            if (isEmpty(strategies)) {
                (async () => {
                    await loadStrategies();
                })();
            }
        },
        [ categoriesFlat, loadCategories, loadStrategies, strategies ],
    );

    useEffect(() => { initiateGetAllContestsQuery(); }, [ initiateGetAllContestsQuery ]);

    const filtersArray = useMemo(
        () => [ FilterType.Status, FilterType.Category, FilterType.Strategy, PageParams.page, FilterType.Sort ],
        [],
    );

    const areQueryParamsValid = useCallback(
        () => {
            const queryParamsArray = Object.values(params).flat();

            const { length: initialQueryParamsCount } = Object.values(params).flat();

            const resultQueryParamsArray = queryParamsArray.filter((y) => {
                const filter = filtersArray.find((x) => toLowerCase(x) === toLowerCase(y.key.toString()));
                const filterValue = toLowerCase(y.value.toString());

                if (isNil(filter) ||
                    (filter === FilterType.Status &&
                        (filterValue !== toLowerCase(ContestStatus.All) &&
                            filterValue !== toLowerCase(ContestStatus.Active) &&
                            filterValue !== toLowerCase(ContestStatus.Past) &&
                            filterValue !== toLowerCase(ContestStatus.Upcoming) &&
                            (filterValue !== toLowerCase(ContestStatus.Practice))))) {
                    return false;
                }

                if (filter === FilterType.Category) {
                    return !isNil(categoriesFlat.find(({ id }) => id.toString() === filterValue));
                }

                if (filter === FilterType.Strategy) {
                    return !isNil(strategies.find(({ id }) => id.toString() === filterValue));
                }

                if (filter === PageParams.page) {
                    return !Number.isNaN(Number(filterValue)) && Number(filterValue) > 0;
                }

                return !(toLowerCase(filter) === FilterType.Sort &&
                    (filterValue !== toLowerCase(SortType.Name) &&
                        filterValue !== toLowerCase(SortType.StartDate) &&
                        filterValue !== toLowerCase(SortType.EndDate)));
            });

            return initialQueryParamsCount === resultQueryParamsArray.length;
        },
        [ filtersArray, params, categoriesFlat, strategies ],
    );

    const handlePageChange = useCallback(
        (page: number) => changePage(page),
        [ changePage ],
    );

    const handleFilterClick = useCallback(
        (filter: IFilter) => toggleParam(filter),
        [ toggleParam ],
    );

    const renderContest = useCallback(
        (contest: IIndexContestsType) => (
            <ContestCard contest={contest} />
        ),
        [],
    );

    const renderContests = useCallback(
        () => {
            if (!isLoaded) {
                return null;
            }

            if (isNil(contests) || isEmpty(contests)) {
                return (
                    <Heading type={HeadingType.secondary}>
                        No contests apply for this filter
                    </Heading>
                );
            }

            const { pagesCount } = pagesInfo;
            return (
                <div className={styles.contestsListContainer}>
                    <PaginationControls
                      count={pagesCount}
                      page={currentPage}
                      onChange={handlePageChange}
                    />
                    <List
                      values={contests}
                      itemFunc={renderContest}
                      className={styles.contestsList}
                      orientation={Orientation.horizontal}
                      wrap
                    />
                </div>
            );
        },
        [ contests, currentPage, handlePageChange, isLoaded, pagesInfo, renderContest ],
    );

    useEffect(
        () => {
            if (!areQueryParamsValid() && isLoaded) {
                setShowAlert(true);
                clearParams();
            }
        },
        [ areQueryParamsValid, isLoaded, clearParams ],
    );

    return (
        <>
            {contestsAreLoading && <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>}
            {showAlert &&
              (
                  <Alert
                    message="The category you requested was not valid, all contests were loaded."
                    severity={AlertSeverity.Error}
                    variant={AlertVariant.Filled}
                    autoHideDuration={3000}
                    vertical={AlertVerticalOrientation.Bottom}
                    horizontal={AlertHorizontalOrientation.Right}
                  />
              )}
            <ContestBreadcrumb />
            <div className={styles.container}>
                <ContestFilters onFilterClick={handleFilterClick} />
                <div className={styles.mainHeader}>
                    {renderContests()}
                </div>
            </div>
        </>
    );
};

export default setLayout(ContestsPage, true);
