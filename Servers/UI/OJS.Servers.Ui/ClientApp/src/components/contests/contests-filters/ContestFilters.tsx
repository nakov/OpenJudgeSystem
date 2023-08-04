import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { InputLabel, MenuItem, Select } from '@mui/material';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { FilterType, IFilter } from '../../../common/contest-types';
import { groupByType } from '../../../common/filter-utils';
import { useContestCategories } from '../../../hooks/use-contest-categories';
import { useCategoriesBreadcrumbs } from '../../../hooks/use-contest-categories-breadcrumb';
import { useContestStrategyFilters } from '../../../hooks/use-contest-strategy-filters';
import { useContests } from '../../../hooks/use-contests';
import Button, { ButtonSize, ButtonType } from '../../guidelines/buttons/Button';
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

const ContestFilters = ({ onFilterClick }: IContestFiltersProps) => {
    const maxFiltersToDisplayCount = 3;
    const { search } = useLocation();
    const [ selectValue, setSelectValue ] = useState('');
    const [ filtersGroups, setFiltersGroups ] = useState<IFiltersGroup[]>([]);
    const [ defaultSelected, setDefaultSelected ] = useState('');
    const [ filteredStrategyFilters, setFilteredStrategyFilters ] = useState<IFilter[]>([]);
    const [ searchParams ] = useSearchParams();
    const [ isLoaded, setIsLoaded ] = useState(false);
    const {
        state: { isLoaded: isLoadedStrategies },
        actions: { load: loadStrategies },
    } = useContestStrategyFilters();
    const {
        state: { isLoaded: isLoadedCategories },
        actions: { load: loadCategories },
    } = useContestCategories();

    const {
        state: { possibleFilters },
        actions: {
            toggleParam,
            clearFilters,
            clearSorts,
        },
    } = useContests();

    const { actions: { clearBreadcrumb } } = useCategoriesBreadcrumbs();

    React.useEffect(() => {
        const allSearches = search.split('&');
        const strategySearch = allSearches.filter((s) => s.includes('strategy'))[0];
        if (!allSearches || !strategySearch) {
            setSelectValue('');
            return;
        }

        const strategyId = strategySearch.split('=')[1];
        setSelectValue(strategyId);
    }, [ search ]);

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

    const handleStrategySelect = useCallback((param: IFilter) => {
        toggleParam(param);
    }, [ toggleParam ]);

    const renderFilter = useCallback(
        (fg: IFiltersGroup) => {
            const { type, filters: groupFilters } = fg;

            const strategyFilters = isEmpty(filteredStrategyFilters)
                ? groupFilters
                : filteredStrategyFilters;

            if (type === FilterType.Strategy) {
                return (
                    <div style={{ marginTop: 15 }}>
                        <InputLabel id="strategy-label">Strategy</InputLabel>
                        <Select
                          sx={{
                              width: 350,
                              height: 40,
                              border: '2px solid #42abf8',
                              borderRadius: 2,
                              transition: 'all .2s ease-in-out',
                              '&& fieldset': { border: 'none' },
                              '&:hover': { backgroundColor: '#e3f3fd' },
                          }}
                          defaultValue=""
                          labelId="strategy-label"
                          autoWidth
                          displayEmpty
                          value={selectValue}
                        >
                            <MenuItem key="strategy-item-default" value="">Select strategy</MenuItem>
                            {strategyFilters.map((item) => (
                                <MenuItem
                                  key={`strategy-item-${item.value}`}
                                  value={item.value}
                                  onClick={() => handleStrategySelect(item)}
                                >
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                );
            }

            const values = type === FilterType.Status
                ? groupFilters
                : strategyFilters;

            return (
                <ContestFilter
                  values={values}
                  type={type}
                  onSelect={handleFilterClick}
                  maxDisplayCount={maxFiltersToDisplayCount}
                />
            );
        },
        [ filteredStrategyFilters, handleFilterClick, handleStrategySelect, selectValue ],
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
            if (isLoadedCategories) {
                return;
            }

            (async () => {
                await loadStrategies();
            })();
        },
        [ isLoadedCategories, loadStrategies ],
    );

    useEffect(
        () => {
            if (isLoadedStrategies) {
                return;
            }

            (async () => {
                await loadCategories();
            })();
        },
        [ isLoadedStrategies, loadCategories ],
    );

    const clearFiltersAndBreadcrumbAndSorting = useCallback(
        () => {
            clearFilters();
            clearBreadcrumb();
            clearSorts();
        },
        [ clearFilters, clearBreadcrumb, clearSorts ],
    );

    return (
        <div className={styles.container}>
            <Button
              type={ButtonType.secondary}
              onClick={() => clearFiltersAndBreadcrumbAndSorting()}
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
            {/* Commented out because displaying sorting menu to
            the user is no longer a wanted feature
            <ContestSorting onSortClick={handleSortClick} /> */}
            <List
              values={filtersGroups}
              itemFunc={renderFilter}
              fullWidth
            />
        </div>
    );
};

export default ContestFilters;
