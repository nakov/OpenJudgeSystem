import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { ContestStatus, IFilter } from '../../common/contest-types';
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
import { useContests } from '../../hooks/use-contests';
import { usePages } from '../../hooks/use-pages';
import concatClassNames from '../../utils/class-names';
import { toLowerCase } from '../../utils/string-utils';
import NotFoundPage from '../not-found/NotFoundPage';
import { setLayout } from '../shared/set-layout';

import styles from './ContestsPage.module.scss';

type ContestStatusStrings = keyof typeof ContestStatus;

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
    const { state: { categoriesFlat } } = useContestCategories();
    const navigate = useNavigate();
    const { state: params } = useUrlParams();

    const filtersArray = useMemo(
        () => [ 'status', 'category', 'strategy', 'page', 'sorttype' ],
        [],
    );

    const validateQueryParams = useCallback(
        () => {
            const paramsArray = Object.values(params).flat();
            paramsArray.map((y) => {
                const test = filtersArray.find((x) => x === toLowerCase(y.key.toString()));

                switch (test) {
                case filtersArray[0]: {
                    
                    if (toLowerCase(y.value.toString()) === ContestStatus[])) {

                    }
                    break;
                }
                default: {
                    return <NotFoundPage />;
                }
                }
            });
        },
        [ filtersArray, params ],
    );
    useEffect(
        () => {
            initiateGetAllContestsQuery();
        },
        [ initiateGetAllContestsQuery ],
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
};

export default setLayout(ContestsPage, true);
