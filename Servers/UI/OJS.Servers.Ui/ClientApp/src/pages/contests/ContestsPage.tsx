import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { ContestStatus, FilterType, IFilter, SortType } from '../../common/contest-types';
import { PageParams } from '../../common/pages-types';
import { IIndexContestsType } from '../../common/types';
import ContestFilters from '../../components/contests/contests-filters/ContestFilters';
import Breadcrumb from '../../components/guidelines/breadcrumb/Breadcrumb';
import { Button, ButtonType } from '../../components/guidelines/buttons/Button';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import List, { Orientation } from '../../components/guidelines/lists/List';
import PaginationControls from '../../components/guidelines/pagination/PaginationControls';
import ContestCard from '../../components/home-contests/contest-card/ContestCard';
import { useUrlParams } from '../../hooks/common/use-url-params';
import { useAppUrls } from '../../hooks/use-app-urls';
import { useContestCategories } from '../../hooks/use-contest-categories';
import { ICategoriesBreadcrumbItem, useCategoriesBreadcrumbs } from '../../hooks/use-contest-categories-breadcrumb';
import { useContestStrategyFilters } from '../../hooks/use-contest-strategy-filters';
import { useContests } from '../../hooks/use-contests';
import { usePages } from '../../hooks/use-pages';
import concatClassNames from '../../utils/class-names';
import { toLowerCase } from '../../utils/string-utils';
import NotFoundPage from '../not-found/NotFoundPage';
import { setLayout } from '../shared/set-layout';

import styles from './ContestsPage.module.scss';

const ContestsPage = () => {
    const {
        state: {
            contests,
            isLoaded,
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
    const { state: { breadcrumbItems }, actions: { updateBreadcrumb } } = useCategoriesBreadcrumbs();
    const { getContestCategoryBreadcrumbItemPath } = useAppUrls();
    const { state: { categoriesFlat }, actions: { load: loadCategories } } = useContestCategories();
    const navigate = useNavigate();
    const { state: params } = useUrlParams();
    const { state: { strategies } } = useContestStrategyFilters();

    useEffect(
        () => {
            initiateGetAllContestsQuery();
            if (!isEmpty(categoriesFlat)) {
                return;
            }

            (async () => {
                await loadCategories();
            })();
        },
        [ initiateGetAllContestsQuery, categoriesFlat, loadCategories ],
    );

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
                        (filterValue !== toLowerCase(ContestStatus.All) && filterValue !== toLowerCase(ContestStatus.Active) &&
                            filterValue !== toLowerCase(ContestStatus.Past)))) {
                    return false;
                }
                if (filter === FilterType.Category) {
                    return !isNil(categoriesFlat.find(({ id }) => id.toString() === filterValue));
                } if (filter === FilterType.Strategy) {
                    return !isNil(strategies.find(({ id }) => id.toString() === filterValue));
                } if (filter === PageParams.page) {
                    return !Number.isNaN(Number(filterValue)) && Number(filterValue) > 0;
                } return !(toLowerCase(filter) === FilterType.Sort &&
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
                      itemClassName={styles.contestItem}
                      className={styles.contestsList}
                      orientation={Orientation.horizontal}
                      wrap
                    />
                </div>
            );
        },
        [ contests, currentPage, handlePageChange, isLoaded, pagesInfo, renderContest ],
    );

    const updateBreadcrumbAndNavigateToCategory = useCallback(
        (breadcrumb: ICategoriesBreadcrumbItem) => {
            const category = categoriesFlat.find(({ id }) => id.toString() === breadcrumb.id.toString());

            updateBreadcrumb(category, categoriesFlat);
            navigate(getContestCategoryBreadcrumbItemPath(breadcrumb.id));
        },
        [ categoriesFlat, navigate, updateBreadcrumb, getContestCategoryBreadcrumbItemPath ],
    );

    const renderCategoriesBreadcrumbItem = useCallback(
        (categoryBreadcrumbItem: ICategoriesBreadcrumbItem) => {
            const { value, isLast } = categoryBreadcrumbItem;
            const classNames = concatClassNames(styles.breadcrumbBtn, isLast
                ? styles.breadcrumbBtnLast
                : '');

            return (
                <Button
                  type={ButtonType.plain}
                  className={classNames}
                  onClick={() => updateBreadcrumbAndNavigateToCategory(categoryBreadcrumbItem)}
                  text={value}
                />
            );
        },
        [ updateBreadcrumbAndNavigateToCategory ],
    );

    const renderPage = useCallback(
        () => {
            if (isNil(categoriesFlat) || isEmpty(categoriesFlat)) {
                return <div>Loading data</div>;
            }
            if (!areQueryParamsValid()) {
                return <NotFoundPage />;
            }

            return (
                <>
                    <Breadcrumb items={breadcrumbItems} itemFunc={renderCategoriesBreadcrumbItem} />
                    <div className={styles.container}>
                        <ContestFilters onFilterClick={handleFilterClick} />
                        <div className={styles.mainHeader}>
                            {renderContests()}
                        </div>
                    </div>
                </>
            );
        },
        [ areQueryParamsValid, breadcrumbItems, handleFilterClick, renderCategoriesBreadcrumbItem, renderContests, categoriesFlat ],
    );

    return renderPage();
};

export default setLayout(ContestsPage, true);
