import React, { useCallback } from 'react';
import { isEmpty, isNil } from 'lodash';
import ContestFilters from '../../components/contests/contests-filters/ContestFilters';
import { useContests } from '../../hooks/use-contests';
import { setLayout } from '../shared/set-layout';
import styles from './ContestsPage.module.scss';
import ContestCard from '../../components/home-contests/contest-card/ContestCard';
import List, { Orientation } from '../../components/guidelines/lists/List';
import PaginationControls from '../../components/guidelines/pagination/PaginationControls';
import { IFilter } from '../../common/contest-types';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import Breadcrumb from '../../components/guidelines/breadcrumb/Breadcrumb';
import { IIndexContestsType } from '../../common/types';
import { useCategoriesBreadcrumbContext } from '../../hooks/submissions/use-contest-categories-breadcrumb';
import Text, { TextType } from '../../components/guidelines/text/Text';

interface ICategoryBreadcrumbItem {
    isLast: boolean,
    value: string,
}

const ContestsPage = () => {
    const {
        state: {
            contests,
            pagesInfo,
            currentPage,
        },
        actions: {
            toggleFilter,
            changePage,
        },
    } = useContests();
    
    const { state: { breadcrumbItems } } = useCategoriesBreadcrumbContext();

    const handlePageChange = useCallback(
        (page: number) => changePage(page),
        [ changePage ],
    );

    const handleFilterClick = useCallback(
        (filter: IFilter) => toggleFilter(filter),
        [ toggleFilter ],
    );

    const renderContest = useCallback(
        (contest: IIndexContestsType) => (
            <ContestCard contest={contest}/>
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
        (categoryBreadcrumbItem: ICategoryBreadcrumbItem) => {
            const { value, isLast } = categoryBreadcrumbItem;

            return (
                <Text type={isLast
                    ? TextType.Bold
                    : TextType.Normal} text={value} />
            );
        },
        [ ],
    );

    return (
        <>
            <Breadcrumb items={breadcrumbItems} itemFunc={renderCategoriesBreadcrumbItem} />
            <div className={styles.container}>
                <ContestFilters onFilterClick={handleFilterClick}/>
                <div>
                    {renderContests()}
                </div>
            </div>
        </>
    );
};

export default setLayout(ContestsPage, true);
