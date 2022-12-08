import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { FilterType, IFilter, ISort } from '../../../common/contest-types';
import { groupByType } from '../../../common/filter-utils';
import { useContestCategories } from '../../../hooks/use-contest-categories';
import { useCategoriesBreadcrumbs } from '../../../hooks/use-contest-categories-breadcrumb';
import { useContestStrategyFilters } from '../../../hooks/use-contest-strategy-filters';
import { useContests } from '../../../hooks/use-contests';
import Button, { ButtonSize, ButtonType } from '../../guidelines/buttons/Button';
import List from '../../guidelines/lists/List';
import ContestCategories from '../contest-categories/ContestCategories';
import ContestFilter from '../contest-filter/ContestFilter';
import ContestSorting from '../contest-sorting/ContestSorting';

import styles from './ContestFilters.module.scss';

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
    const [ filteredStrategyFilters, setFilteredStrategyFilters ] = useState<IFilter[]>([]);
    const [ searchParams ] = useSearchParams();
    const [ isLoaded, setIsLoaded ] = useState(false);
    const { actions: { load: loadStrategies } } = useContestStrategyFilters();
    const { actions: { load: loadCategories } } = useContestCategories();

    const {
        state: { possibleFilters },
        actions: { toggleParam, clearFilters },
    } = useContests();

    const { actions: { clearBreadcrumb } } = useCategoriesBreadcrumbs();

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

            const strategyFilters = isEmpty(filteredStrategyFilters)
                ? groupFilters
                : filteredStrategyFilters;

            return (
                <ContestFilter
                  values={strategyFilters}
                  type={type}
                  onSelect={handleFilterClick}
                  maxDisplayCount={maxFiltersToDisplayCount}
                />
            );
        },
        [ filteredStrategyFilters, handleFilterClick ],
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

    const clearFiltersAndBreadcrumb = useCallback(
        () => {
            clearFilters();
            clearBreadcrumb();
        },
        [ clearFilters, clearBreadcrumb ],
    );

    return (
        <div className={styles.container}>
            <Button
              type={ButtonType.secondary}
              onClick={() => clearFiltersAndBreadcrumb()}
              className={styles.button}
              text="clear filters"
              size={ButtonSize.small}
            />
            <ContestCategories
              className={styles.filterTypeContainer}
              onCategoryClick={onFilterClick}
              defaultSelected={defaultSelected}
              setStrategyFilters={setFilteredStrategyFilters}
            />
            <ContestSorting onSortClick={handleSortClick} />
            <List
              values={filtersGroups}
              itemFunc={renderFilter}
              fullWidth
            />
        </div>
    );
};

export default ContestFilters;
