import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isEmpty, isNil } from 'lodash';
import ContestFilters from '../../components/contests/contests-filters/ContestFilters';
import { useContests } from '../../hooks/use-contests';
import { setLayout } from '../shared/set-layout';
import styles from './ContestsPage.module.scss';
import { IIndexContestsType } from '../../common/types';
import ContestCard from '../../components/home-contests/contest-card/ContestCard';
import List, { Orientation } from '../../components/guidelines/lists/List';
import PaginationControls from '../../components/guidelines/pagination/PaginationControls';
import { FilterType, IFilter } from '../../common/contest-types';

const ContestsPage = () => {
    const {
        state: {
            contests,
            possibleFilters,
            filters,
        },
        actions: { applyFilters },
        pagesCount,
        pageNumber,
    } = useContests();

    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ filtersAreCollected, setFiltersAreCollected ] = useState(false);

    const renderContest = useCallback(
        (contest: IIndexContestsType) => (
            <ContestCard contest={contest} />
        ),
        [],
    );

    const handlePageChange = useCallback(
        (page: number) => {
            applyFilters(filters, page);
        },
        [ applyFilters, filters ],
    );

    const handleFilterClick = useCallback((filter: IFilter) => {
        const { name: filterName, type, value } = filter;
        const paramName = type.toString();
        searchParams.delete(paramName);
        searchParams.delete(paramName.toLowerCase());

        const removeFilter = filters.some(({ name }) => name === filterName) &&
            filter.type !== FilterType.Category;

        if (!removeFilter) {
            searchParams.append(paramName.toLowerCase(), value);
        }

        setSearchParams(searchParams);
        setFiltersAreCollected(false);
    }, [ filters, searchParams, setSearchParams ]);

    useEffect(() => {
        if (isEmpty(possibleFilters) || filtersAreCollected) {
            return;
        }

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
        setFiltersAreCollected(true);
    }, [ applyFilters, filtersAreCollected, possibleFilters, searchParams ]);

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
                  page={pageNumber}
                  onChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default setLayout(ContestsPage, true);
