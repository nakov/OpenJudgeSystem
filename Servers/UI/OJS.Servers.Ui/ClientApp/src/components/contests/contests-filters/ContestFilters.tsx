import React, { useCallback, useEffect, useState } from 'react';
import { isNil } from 'lodash';
import List from '../../guidelines/lists/List';
import Heading from '../../guidelines/headings/Heading';

import { FilterType, IFilter } from '../../../common/contest-types';

import styles from './ContestFilters.module.scss';
import Label from '../../guidelines/labels/Label';
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
        ({ id, name }: IFilter) => (
            <Button
              type="plain"
              onClick={() => handleFilterClick(id)}
              className={styles.btnSelectFilter}
            >
                <Label type="plain">
                    {name}
                </Label>
            </Button>
        ),
        [ handleFilterClick ],
    );

    const renderFilter = ({ type, filters: groupFilters }: IFiltersGroup) => (
        <div>
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
            <List
              values={filtersGroups}
              itemFunc={renderFilter}
              className={styles.listFilters}
              fullWidth
            />
            {JSON.stringify(filters)}
        </div>
    );
};

export default ContestFilters;
