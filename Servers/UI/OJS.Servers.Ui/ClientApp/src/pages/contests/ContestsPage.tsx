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
import { IFilter } from '../../common/contest-types';

const ContestsPage = () => {
    const {
        state: {
            contests,
            possibleFilters,
            filters,
        },
        actions: {
            setPage,
            applyFilters,
        },
        pagesCount,
    } = useContests();

    const [ searchParams, setSearchParams ] = useSearchParams();

    const renderContest = useCallback(
        (contest: IIndexContestsType) => (
            <ContestCard contest={contest} />
        ),
        [],
    );

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const handleFilterClick = useCallback((filter: IFilter) => {
        const { type, value } = filter;
        const name = type.toString();
        searchParams.delete(name);
        searchParams.delete(name.toLowerCase());

        const removeFilter = filters.includes(filter);

        if (!removeFilter) {
            searchParams.append(name.toLowerCase(), value);
        }

        setSearchParams(searchParams);
    }, [ filters, searchParams, setSearchParams ]);

    useEffect(() => {
        const filtersToApply = [] as IFilter[];
        searchParams.forEach((val, key) => {
            const filter = possibleFilters
                .find(({ type, value }) => type.toString().toLowerCase() === key.toLowerCase() &&
                    value.toLowerCase() === val.toLowerCase());
            if (!isNil(filter)) {
                filtersToApply.push(filter);
            }
        });

        applyFilters(filtersToApply);
    }, [ applyFilters, possibleFilters, searchParams ]);

    return (
        <div className={styles.container}>
            <ContestFilters onFilterClick={handleFilterClick} />
            <div>
                <List
                  values={contests}
                  itemFunc={renderContest}
                  orientation={Orientation.horizontal}
                  wrap
                />
                <PaginationControls
                  count={pagesCount}
                  onChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default setLayout(ContestsPage, true);
