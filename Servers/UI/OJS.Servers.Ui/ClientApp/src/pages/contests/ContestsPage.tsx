import React, { useCallback } from 'react';
import { isEmpty, isNil } from 'lodash';
import ContestFilters from '../../components/contests/contests-filters/ContestFilters';
import { useContests } from '../../hooks/use-contests';
import { setLayout } from '../shared/set-layout';
import styles from './ContestsPage.module.scss';
import { IIndexContestsType } from '../../common/types';
import ContestCard from '../../components/home-contests/contest-card/ContestCard';
import List, { Orientation } from '../../components/guidelines/lists/List';
import PaginationControls from '../../components/guidelines/pagination/PaginationControls';
import { IFilter } from '../../common/contest-types';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';

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

    return (
        <div className={styles.container}>

            <ContestFilters onFilterClick={handleFilterClick}/>
            <div>
                {renderContests()}
            </div>
        </div>
    );
};

export default setLayout(ContestsPage, true);
