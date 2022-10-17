import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isNil } from 'lodash';
import { useSearchParams } from 'react-router-dom';
import List from '../../guidelines/lists/List';

import { ContestStatus, FilterType, IFilter, ISort } from '../../../common/contest-types';
import ContestCategories from '../contest-categories/ContestCategories';

import { useContests } from '../../../hooks/use-contests';
import { groupByType } from '../../../common/filter-utils';
import { useContestStrategyFilters } from '../../../hooks/use-contest-strategy-filters';
import { useContestCategories } from '../../../hooks/use-contest-categories';
import ContestFilter from '../contest-filter/ContestFilter';

import styles from './ContestFilters.module.scss';
import ContestSorting from '../contest-sorting/ContestSorting';
import Button, { ButtonSize, ButtonType } from '../../guidelines/buttons/Button';

interface IContestFiltersProps {
    onFilterClick: (filter: IFilter) => void;
}

interface IFiltersGroup {
    type: FilterType;
    filters: IFilter[];
}

const ContestFilters = ({ onFilterClick }: IContestFiltersProps) => {
    const maxFiltersToDisplayCount = 3;
    const [ filtersGroups, setFiltersGroups ] = useState<IFiltersGroup[]>([]);
    const [ defaultSelected, setDefaultSelected ] = useState('');
    const [ searchParams ] = useSearchParams();
    const [ isLoaded, setIsLoaded ] = useState(false);
    const {
        state: { isLoaded: strategiesAreLoaded }, 
        actions: { load: loadStrategies }, 
    } = useContestStrategyFilters();
    const {
        state: { isLoaded: categoriesAreLoaded }, 
        actions: { load: loadCategories }, 
    } = useContestCategories();

    const {
        state: { possibleFilters },
        actions: { toggleParam, clearFilters },
    } = useContests();

    const handleSortClick = useCallback(
        (sorting: ISort) => toggleParam(sorting),
        [ toggleParam ],
    );
    
    const handleFilterClick = useCallback(
        (filterId: number) => {
            const filter = possibleFilters.find(({ id }) => filterId === id);

            if (isNil(filter)) {
                return;
            }

            onFilterClick(filter);
        },
        [ possibleFilters, onFilterClick ],
    );

    const renderFilter = useCallback(
        (fg: IFiltersGroup) => {
            const { type, filters: groupFilters } = fg;

            return (
                <ContestFilter
                    values={groupFilters}
                    type={type}
                    onSelect={handleFilterClick}
                    maxDisplayCount={maxFiltersToDisplayCount}
                />
            );
        },
        [ handleFilterClick ],
    );

    useEffect(
        () => {
            const plainFilters = possibleFilters.filter(({ type }) => type !== FilterType.Category);

            setFiltersGroups(groupByType(plainFilters));
        },
        [ possibleFilters ],
    );

    useEffect(
        () => {
            if (isLoaded) {
                return;
            }

            const searchParamName = FilterType.Category.toString();
            let selectedCategory = searchParams.get(searchParamName);

            if (isNil(selectedCategory)) {
                selectedCategory = searchParams.get(searchParamName.toLowerCase());
            }

            if (isNil(selectedCategory)) {
                return;
            }

            setIsLoaded(true);
            setDefaultSelected(selectedCategory.toString());
        },
        [ isLoaded, searchParams ],
    );

    useEffect(
        () => {
            (async () => {
                await loadStrategies();
            })();
        },
        [ loadStrategies ],
    );

    useEffect(
        () => {
            (async () => {
                await loadCategories();
            })();
        },
        [ loadCategories ],
    );

    const defaultStatusFilterId = useMemo(
        () => {
            if (strategiesAreLoaded && categoriesAreLoaded) {
                const statusFilters = possibleFilters.filter(f => f.type === FilterType.Status);
                
                return statusFilters.filter(sf => sf.name === ContestStatus.All)[0].id;
            } 
                
            return null;
        },
        [ possibleFilters, strategiesAreLoaded, categoriesAreLoaded ],
    );

    return (
        <div className={styles.container}>
            <Button
                type={ButtonType.secondary}
                onClick={() => clearFilters(FilterType.Status, defaultStatusFilterId)}
                className={styles.button}
                text='clear filters'
                size={ButtonSize.small}
            />
            <ContestCategories
                className={styles.filterTypeContainer}
                onCategoryClick={onFilterClick}
                defaultSelected={defaultSelected}
            />
            <ContestSorting onSortClick={handleSortClick}/>
            <List
                values={filtersGroups}
                itemFunc={renderFilter}
                fullWidth
            />
        </div>
    );
};

export default ContestFilters;
