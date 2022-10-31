import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import isNil from 'lodash/isNil';

import { FilterType, IFilter } from '../../../common/contest-types';
import { groupByType } from '../../../common/filter-utils';
import { useContestCategories } from '../../../hooks/use-contest-categories';
import { useContestStrategyFilters } from '../../../hooks/use-contest-strategy-filters';
import { useContests } from '../../../hooks/use-contests';
import List from '../../guidelines/lists/List';
import ContestCategories from '../contest-categories/ContestCategories';
import ContestFilter from '../contest-filter/ContestFilter';

import styles from './ContestFilters.module.scss';

interface IContestFiltersProps {
    onFilterClick: (filter: IFilter) => void;
}

interface IFiltersGroup {
    type: FilterType;
    filters: IFilter[];
}

const defaultState = { id: 1 };

const ContestFilters = ({ onFilterClick }: IContestFiltersProps) => {
    const maxFiltersToDisplayCount = 3;
    const [ filtersGroups, setFiltersGroups ] = useState<IFiltersGroup[]>([]);
    const [ defaultSelected, setDefaultSelected ] = useState('');
    const [ currentSelectedStatusFilter, setSelectedStatusFilter ] = useState(defaultState.id);
    const [ currentSelectedStrategyFilter, setSelectedStrategyFilter ] = useState(Number);
    const [ previousSelectedStatusButton, setPreviousSelectedStatusButton ] = useState(defaultState.id);
    const [ previousSelectedStrategyButton, setPreviousSelectedStrategyButton ] = useState(0);
    const [ searchParams ] = useSearchParams();
    const [ isLoaded, setIsLoaded ] = useState(false);
    const { actions: { load: loadStrategies } } = useContestStrategyFilters();
    const { actions: { load: loadCategories } } = useContestCategories();

    const { state: { possibleFilters } } = useContests();

    const handleFilterClick = useCallback(
        (filterId: number, filterType: FilterType) => {
            const filter = possibleFilters.find(({ id }) => filterId === id);

            if (isNil(filter)) {
                return;
            }

            onFilterClick(filter);

            if (FilterType.Status === filterType) {
                if (previousSelectedStatusButton === filterId) {
                    setSelectedStatusFilter(defaultState.id);
                    setPreviousSelectedStatusButton(defaultState.id);
                } else {
                    setSelectedStatusFilter(filterId);
                    setPreviousSelectedStatusButton(filterId);
                }
            } else if (FilterType.Strategy === filterType) {
                if (previousSelectedStrategyButton === filterId) {
                    setSelectedStrategyFilter(0);
                    setPreviousSelectedStrategyButton(0);
                } else {
                    setSelectedStrategyFilter(filterId);
                    setPreviousSelectedStrategyButton(filterId);
                }
            }
        },
        [ possibleFilters, onFilterClick, previousSelectedStatusButton, previousSelectedStrategyButton ],
    );

    const renderFilter = useCallback(
        (fg: IFiltersGroup) => {
            const { type, filters: groupFilters } = fg;

            return (
                <ContestFilter
                  values={groupFilters}
                  type={type}
                    statusFilterId={currentSelectedStatusFilter}
                    strategyFilterId={currentSelectedStrategyFilter}
                  onSelect={handleFilterClick}
                  maxDisplayCount={maxFiltersToDisplayCount}
                />
            );
        },
        [ currentSelectedStatusFilter, currentSelectedStrategyFilter, handleFilterClick ],
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

    return (
        <div className={styles.container}>
            <ContestCategories
              className={styles.filterTypeContainer}
              onCategoryClick={onFilterClick}
              defaultSelected={defaultSelected}
            />
            <List
              values={filtersGroups}
              itemFunc={renderFilter}
              fullWidth
            />
        </div>
    );
};

export default ContestFilters;
