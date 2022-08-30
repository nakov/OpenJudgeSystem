import React, { useCallback, useEffect, useState } from 'react';
import { isEmpty, isNil } from 'lodash';
import ContestFilters from '../../components/contests/contests-filters/ContestFilters';
import { useContests } from '../../hooks/use-contests';
import { setLayout } from '../shared/set-layout';
import styles from './ContestsPage.module.scss';
import { IIndexContestsType } from '../../common/types';
import ContestCard from '../../components/home-contests/contest-card/ContestCard';
import List, { Orientation } from '../../components/guidelines/lists/List';
import PaginationControls from '../../components/guidelines/pagination/PaginationControls';
import { ContestStatus, FilterType, IFilter } from '../../common/contest-types';
import { filterByType } from '../../common/filter-utils';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import { useUrlParams } from '../../hooks/common/use-url-params';

const ContestsPage = () => {
    const {
        state: {
            contests,
            possibleFilters,
            filters,
            pagesCount,
            pageNumber,
        },
        actions: { applyFilters },
    } = useContests();

    const {
        state: { params },
        actions: {
            setParam,
            unsetParam,
        },
    } = useUrlParams();
    const [ filtersAreCollected, setFiltersAreCollected ] = useState(false);
    const handlePageChange = useCallback(
        (page: number) => {
            applyFilters(filters, page);
        },
        [ applyFilters, filters ],
    );

    const handleFilterClick = useCallback(
        async (filter: IFilter) => {
            const { name: filterName, type, value } = filter;
            const paramName = type.toString();

            await unsetParam(paramName);

            const shouldRemoveFilter = filters.some(({ name }) => name === filterName) &&
                filter.type !== FilterType.Category;

            if (!shouldRemoveFilter) {
                await setParam(paramName, value);
            }

            setFiltersAreCollected(false);
        },
        [ filters, setParam, unsetParam ],
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

            return (
                <>
                    <PaginationControls
                      count={pagesCount}
                      page={pageNumber}
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
        [ contests, handlePageChange, pageNumber, pagesCount, renderContest ],
    );

    useEffect(() => {
        if (isEmpty(possibleFilters) || filtersAreCollected) {
            return;
        }

        const filtersToApply = params.reduce((fa, { value, key }) => {
            const filter = possibleFilters
                .find(({ type, value: val }) => type.toString().toLowerCase() === key.toLowerCase() &&
                    value.toLowerCase() === val.toLowerCase());

            if(!isNil(filter)) {
                fa.push(filter);
            }

            return fa;
        }, []);

        if (isEmpty(filterByType(filtersToApply, FilterType.Status))) {
            const defaultStatusFilters = filterByType(possibleFilters, FilterType.Status)
                .filter(({ name }) => name === ContestStatus.All);

            filtersToApply.push(...defaultStatusFilters);
        }

        applyFilters(filtersToApply);
        setFiltersAreCollected(true);
    }, [ applyFilters, filtersAreCollected, params, possibleFilters ]);

    return (
        <div className={styles.container}>

            <ContestFilters onFilterClick={handleFilterClick} />
            <div>
                {renderContests()}
            </div>
        </div>
    );
};

export default setLayout(ContestsPage, true);
