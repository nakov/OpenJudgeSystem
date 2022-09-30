import React, { useCallback, useEffect, useState } from 'react';
import { isNil } from 'lodash';
import { useSearchParams } from 'react-router-dom';
import List, { Orientation } from '../../guidelines/lists/List';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';

import { FilterType, IFilter } from '../../../common/contest-types';
import ContestCategories from '../contest-categories/ContestCategories';

import styles from './ContestFilters.module.scss';
import Button, { ButtonSize, ButtonType } from '../../guidelines/buttons/Button';
import { useContests } from '../../../hooks/use-contests';
import { groupByType } from '../../../common/filter-utils';
import ExpandButton from '../../guidelines/buttons/ExpandButton';
import concatClassNames from '../../../utils/class-names';
import { useContestStrategyFilters } from '../../../hooks/use-contest-strategy-filters';
import { useContestCategories } from '../../../hooks/use-contest-categories';

interface IContestFiltersProps {
    onFilterClick: (filter: IFilter) => void;
}

interface IFiltersGroup {
    type: FilterType;
    filters: IFilter[];
}

const ContestFilters = ({ onFilterClick }: IContestFiltersProps) => {
    const [ filtersGroups, setFiltersGroups ] = useState<IFiltersGroup[]>([]);
    const [ expanded, setExpanded ] = useState(false);
    const [ defaultSelected, setDefaultSelected ] = useState('');
    const [ searchParams ] = useSearchParams();
    const [ isLoaded, setIsLoaded ] = useState(false);
    const { actions: { load: loadStrategies } } = useContestStrategyFilters();
    const { actions: { load: loadCategories } } = useContestCategories();

    const {
        state: {
            possibleFilters,
            filters,
        },
    } = useContests();

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

    const getRenderFilterItemFunc = useCallback(
        (type: FilterType) => ({ id, name }: IFilter) => {
            // TODO: investigate why filters change ids
            //  and use id instead of name for checking if filter is selected
            const filterIsSelected = filters.some((f) => f.name === name);
            const buttonType = filterIsSelected
                ? ButtonType.primary
                : ButtonType.secondary;

            const btnClassName = type === FilterType.Status
                ? styles.btnSelectFilter
                : '';

            return (
                <Button
                  type={buttonType}
                  onClick={() => handleFilterClick(id)}
                  className={btnClassName}
                  text={name}
                  size={ButtonSize.small}
                />
            );
        },
        [ handleFilterClick, filters ],
    );

    const toggleFiltersExpanded = useCallback(
        (isExpanded: boolean) => setExpanded(isExpanded),
        [],
    );

    const renderExpandButton = useCallback(
        (allFilters: IFilter[]) => {
            const maxFiltersToDisplayCount = 3;

            return allFilters.length > maxFiltersToDisplayCount
                ? <ExpandButton onExpandChanged={toggleFiltersExpanded} />
                : null;
        },
        [ toggleFiltersExpanded ],
    );

    const renderFilter = useCallback(
        (fg: IFiltersGroup) => {
            const { type, filters: groupFilters } = fg;
            const className = concatClassNames(
                styles.listFilters,
                expanded
                    ? styles.expanded
                    : '',
            );

            const listOrientation = type === FilterType.Status
                ? Orientation.horizontal
                : Orientation.vertical;

            return (
                <div className={styles.filterTypeContainer}>
                    <Heading
                      type={HeadingType.small}
                      className={styles.heading}
                    >
                        {type}
                    </Heading>
                    <List
                      values={groupFilters}
                      itemFunc={getRenderFilterItemFunc(type)}
                      orientation={listOrientation}
                      className={className}
                      itemClassName={styles.listFilterItem}
                      fullWidth
                    />
                    {renderExpandButton(groupFilters)}
                </div>
            );
        },
        [ expanded, getRenderFilterItemFunc, renderExpandButton ],
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
