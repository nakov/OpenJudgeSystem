import React, { useCallback } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { FilterType, IFilter } from '../../common/contest-types';
import { PageTitles } from '../../common/page-titles';
import { IIndexContestsType } from '../../common/types';
import { ChangePageTitle } from '../../components/common/ChangePageTitle';
import ContestFilters from '../../components/contests/contests-filters/ContestFilters';
import Breadcrumb from '../../components/guidelines/breadcrumb/Breadcrumb';
import { LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import List, { Orientation } from '../../components/guidelines/lists/List';
import PaginationControls from '../../components/guidelines/pagination/PaginationControls';
import ContestCard from '../../components/home-contests/contest-card/ContestCard';
import { ICategoriesBreadcrumbItem, useCategoriesBreadcrumbs } from '../../hooks/use-contest-categories-breadcrumb';
import { useContests } from '../../hooks/use-contests';
import concatClassNames from '../../utils/class-names';
import { setLayout } from '../shared/set-layout';

import styles from './ContestsPage.module.scss';

const getBreadcrumbItemPath = (id: string) => `/contests?${FilterType.Category.toString()}=${id}`;

const ContestsPage = () => {
    const {
        state: {
            contests,
            pagesInfo,
            currentPage,
        },
        actions: {
            toggleParam,
            changePage,
        },
    } = useContests();

    const { state: { breadcrumbItems } } = useCategoriesBreadcrumbs();

    ChangePageTitle(PageTitles.contests);

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
            if (isNil(contests) || isEmpty(contests)) {
                return (
                    <Heading type={HeadingType.secondary}>
                        No contests apply for this filter
                    </Heading>
                );
            }

            const { pagesCount } = pagesInfo;

            return (
                <>
                    <PaginationControls
                      count={pagesCount}
                      page={currentPage}
                      onChange={handlePageChange}
                    />
                    <List
                      values={contests}
                      itemFunc={renderContest}
                      itemClassName={styles.contestItem}
                      orientation={Orientation.horizontal}
                      wrap
                    />
                </>
            );
        },
        [ contests, currentPage, handlePageChange, pagesInfo, renderContest ],
    );

    const renderCategoriesBreadcrumbItem = useCallback(
        (categoryBreadcrumbItem: ICategoriesBreadcrumbItem) => {
            const { value, isLast, id } = categoryBreadcrumbItem;
            const classNames = concatClassNames(styles.breadcrumbBtn, isLast
                ? styles.breadcrumbBtnLast
                : '');

            return (
                <LinkButton type={LinkButtonType.plain} className={classNames} to={getBreadcrumbItemPath(id)} text={value} />
            );
        },
        [ ],
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
