import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { FilterType, IFilter /* ISort */ } from '../../../common/contest-types';
import { groupByType } from '../../../common/filter-utils';
import { useContestCategories } from '../../../hooks/use-contest-categories';
import { useCategoriesBreadcrumbs } from '../../../hooks/use-contest-categories-breadcrumb';
import { useContestStrategyFilters } from '../../../hooks/use-contest-strategy-filters';
import { useContests } from '../../../hooks/use-contests';
import { usePages } from '../../../hooks/use-pages';
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
    const [ filtersGroups, setFiltersGroups ] = useState<IFiltersGroup[]>([]);
    const [ defaultSelected, setDefaultSelected ] = useState('');
    const [ filteredStrategyFilters, setFilteredStrategyFilters ] = useState<IFilter[]>([]);
    const [ isClearFiltersButtonClicked, setIsClearFiltersButtonClicked ] = useState(false);
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
            // toggleParam,
            clearFilters,
            clearSorts,
        },
    } = useContests();

    const { actions: { clearBreadcrumb } } = useCategoriesBreadcrumbs();

    const { clearPageValue } = usePages();

    // const handleSortClick = useCallback(
    //     (sorting: ISort) => toggleParam(sorting),
    //     [ toggleParam ],
    // );

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

    const clearFiltersAndBreadcrumbAndSortingAndPages = useCallback(
        () => {
            clearFilters();
            clearBreadcrumb();
            clearSorts();
            clearPageValue();
            setIsClearFiltersButtonClicked(!isClearFiltersButtonClicked);
        },
        [ clearFilters, clearBreadcrumb, clearSorts, clearPageValue, isClearFiltersButtonClicked ],
    );

    return (
        <div className={styles.container}>
            <Button
              type={ButtonType.secondary}
              onClick={() => clearFiltersAndBreadcrumbAndSortingAndPages()}
              className={styles.button}
              text="clear filters"
              size={ButtonSize.small}
            />
            <ContestCategories
              className={styles.filterTypeContainer}
              onCategoryClick={onFilterClick}
              defaultSelected={defaultSelected}
              setStrategyFilters={setFilteredStrategyFilters}
              isClearFiltersButtonClicked={isClearFiltersButtonClicked}
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
