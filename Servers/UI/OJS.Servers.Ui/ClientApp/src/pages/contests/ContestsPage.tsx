import React, { useCallback, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IFilter } from '../../common/contest-types';
import { IIndexContestsType } from '../../common/types';
import ContestFilters from '../../components/contests/contests-filters/ContestFilters';
import Breadcrumb from '../../components/guidelines/breadcrumb/Breadcrumb';
import { LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import List, { Orientation } from '../../components/guidelines/lists/List';
import PaginationControls from '../../components/guidelines/pagination/PaginationControls';
import ContestCard from '../../components/home-contests/contest-card/ContestCard';
import { useHashUrlParams } from '../../hooks/common/use-hash-url-params';
import { useAppUrls } from '../../hooks/use-app-urls';
import { ICategoriesBreadcrumbItem, useCategoriesBreadcrumbs } from '../../hooks/use-contest-categories-breadcrumb';
import { useContests } from '../../hooks/use-contests';
import concatClassNames from '../../utils/class-names';
import { setLayout } from '../shared/set-layout';

import styles from './ContestsPage.module.scss';

const ContestsPage = () => {
    const {
        state: {
            contests,
            pagesInfo,
            currentPage,
            isLoaded,
        },
        actions: {
            toggleParam,
            changePage,
            initiateGetAllContestsQuery,
        },
    } = useContests();

    const { state: { breadcrumbItems } } = useCategoriesBreadcrumbs();
    const { state: { params }, actions: { clearHash } } = useHashUrlParams();
    const { getContestCategoryBreadcrumbItemPath } = useAppUrls();

    useEffect(() => {
        initiateGetAllContestsQuery();

        if (!isEmpty(params)) {
            clearHash();
        }
    }, [ clearHash, params, initiateGetAllContestsQuery ]);

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

    const renderCategoriesBreadcrumbItem = useCallback(
        (categoryBreadcrumbItem: ICategoriesBreadcrumbItem) => {
            const { value, isLast, id } = categoryBreadcrumbItem;
            const classNames = concatClassNames(styles.breadcrumbBtn, isLast
                ? styles.breadcrumbBtnLast
                : '');

            return (
                <LinkButton type={LinkButtonType.plain} className={classNames} to={getContestCategoryBreadcrumbItemPath(id)} text={value} />
            );
        },
        [ getContestCategoryBreadcrumbItemPath ],
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
