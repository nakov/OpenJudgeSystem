import React, { useCallback, useEffect, useState } from 'react';
import { isNil } from 'lodash';
import List from '../../guidelines/lists/List';
import Heading from '../../guidelines/headings/Heading';

import { FilterType, IFilter } from '../../../common/contest-types';
import ContestCategories from '../../../components/contests/contest-categories/ContestCategories';

import styles from './ContestFilters.module.scss';
import Button from '../../guidelines/buttons/Button';
import { useContests } from '../../../hooks/use-contests';
import { groupByType } from '../../../common/filter-utils';

interface IFiltersGroup {
    type: FilterType;
    filters: IFilter[];
}

const ContestFilters = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ filtersGroups, setFiltersGroups ] = useState<IFiltersGroup[]>([]);

    const {
        state: {
            possibleFilters,
            filters,
        },
        actions: { applyFilter },
    } = useContests();

    const handleFilterClick = useCallback(
        (filterId: number) => {
            const filter = possibleFilters.find(({ id }) => filterId === id);
            if (isNil(filter)) {
                return;
            }

            applyFilter(filter);
        },
        [ applyFilter, possibleFilters ],
    );

    const renderFilterItem = useCallback(
        ({ id, name }: IFilter) => {
            const filterIsSelected = filters.some(f => f.id === id);
            const type = filterIsSelected ? "primary" : "secondary";
            const size = filterIsSelected ? "medium" : "small";

            return (
                <Button
                    type={type}
                    onClick={() => handleFilterClick(id)}
                    className={styles.btnSelectFilter}
                    text={name}
                    size={size}
                />
        )},
        [ handleFilterClick ],
    );

    const renderFilter = ({ type, filters: groupFilters }: IFiltersGroup) => (
        <div className={styles.filterTypeContainer}>
            <Heading
              type="small"
              className={styles.heading}
            >
                {type}
            </Heading>
            <List
              values={groupFilters}
              itemFunc={renderFilterItem}
              orientation="horizontal"
              className={styles.listFilterItems}
              itemClassName={styles.listFilterItem}
            />
        </div>
    );

    useEffect(
        () => {
            setFiltersGroups(groupByType(possibleFilters));
        },
        [ possibleFilters ],
    );

    return (
        <div className={styles.container}>
            <Heading type="secondary">Filters: </Heading>
            <ContestCategories className={styles.filterTypeContainer} />
            <List
              values={filtersGroups}
              itemFunc={renderFilter}
              fullWidth
            />
        </div>
    );
};

export default ContestFilters;
