import React, { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isNil } from 'lodash';
import ContestFilters from '../../components/contests/contests-filters/ContestFilters';
import { useContests } from '../../hooks/use-contests';
import { setLayout } from '../shared/set-layout';
import styles from './ContestsPage.module.scss';
import { IIndexContestsType } from '../../common/types';
import ContestCard from '../../components/home-contests/contest-card/ContestCard';
import List, { Orientation } from '../../components/guidelines/lists/List';
import PaginationControls from '../../components/guidelines/pagination/PaginationControls';

const ContestsPage = () => {
    const {
        state: {
            contests,
            filters,
        },
        actions: { setPage },
        pagesCount,
    } = useContests();

    // TODO: this will be fixed in next PR
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ searchParams, setSearchParams ] = useSearchParams();

    const renderContest = useCallback(
        (contest: IIndexContestsType) => (
            <ContestCard contest={contest} />
        ),
        [],
    );

    const onPageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setPage(page);
    };

    useEffect(
        () => {
            setSearchParams(filters.reduce((p:any, { type, value }) => {
                const values = isNil(p[type])
                    ? []
                    : p[type];
                values.push(value);

                return {
                    ...p,
                    [type]: values,
                };
            }, {}));
        },
        [ filters, setSearchParams ],
    );

    return (
        <div className={styles.container}>
            <ContestFilters />
            <div>
                <List
                  values={contests}
                  itemFunc={renderContest}
                  orientation={Orientation.horizontal}
                  wrap
                />
                <PaginationControls
                  count={pagesCount}
                  onChange={onPageChange}
                />
            </div>
        </div>
    );
};

export default setLayout(ContestsPage, true);
