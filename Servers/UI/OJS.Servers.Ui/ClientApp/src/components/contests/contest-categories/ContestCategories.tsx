import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';
import uniq from 'lodash/uniq';

import ICategoryStrategiesTypes from '../../../common/category-strategies-types';
import { FilterType, IFilter } from '../../../common/contest-types';
import ITreeItemType from '../../../common/tree-types';
import { useContestCategories } from '../../../hooks/use-contest-categories';
import { useCategoriesBreadcrumbs } from '../../../hooks/use-contest-categories-breadcrumb';
import { useContests } from '../../../hooks/use-contests';
import { flattenWith } from '../../../utils/list-utils';
import { IHaveOptionalClassName } from '../../common/Props';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import Tree from '../../guidelines/trees/Tree';

import styles from './ContestCategories.module.scss';

interface IContestCategoriesProps extends IHaveOptionalClassName {
    onCategoryClick: (filter: IFilter) => void;
    defaultSelected?: string;
    setStrategyFilters: Dispatch<SetStateAction<IFilter[]>>;
}

interface IFilterProps {
    categoryId: string;
    strategies: IFilter[];
}

const defaultState = {
    state: {
        currentStrategyFilters: [] as IFilterProps[],
        filterProps: [] as IFilterProps[],
    },
};
const ContestCategories = ({
    className = '',
    onCategoryClick,
    defaultSelected,
    setStrategyFilters,
}: IContestCategoriesProps) => {
    const { state: { categories } } = useContestCategories();
    const { state: { possibleFilters } } = useContests();
    const { actions: { updateBreadcrumb } } = useCategoriesBreadcrumbs();
    const [ currentStrategyFilters, setCurrentCurrentStrategyFilters ] = useState(defaultState.state.currentStrategyFilters);
    const [ filterProps, setFilterProps ] = useState(defaultState.state.filterProps);

    const getParents = useCallback(
        (result: string[], allItems: ITreeItemType[], searchId?: string) => {
            if (isNil(searchId)) {
                return result;
            }

            const node = allItems.find(({ id }) => id.toString() === searchId);

            if (isNil(node)) {
                return result;
            }

            if (node.id.toString() === searchId) {
                result.push(searchId);
            }

            getParents(result, allItems, node.parentId?.toString());

            return result;
        },
        [],
    );

    const categoriesFlat = useMemo(
        () => flattenWith(categories, (c) => c.children || null),
        [ categories ],
    );

    const defaultExpanded = useMemo(
        () => getParents([], categoriesFlat, defaultSelected),
        [ defaultSelected, categoriesFlat, getParents ],
    );

    const strategyFilterGroup = useMemo(
        () => possibleFilters.filter(({ type }) => type === FilterType.Strategy),
        [ possibleFilters ],
    );

    const addNewStrategyFilters = useCallback(
        (id: string, { allowedStrategyTypes }: ICategoryStrategiesTypes) => {
            const strategyFiltersToAdd = allowedStrategyTypes
                ?.map((value) => value.id.toString())
                .map((x) => strategyFilterGroup.find((y) => y.value === x))
                .filter((x) => !isNil(x)) as IFilter[];

            setFilterProps([
                ...filterProps,
                { categoryId: id, strategies: strategyFiltersToAdd },
            ]);
        },
        [ filterProps, strategyFilterGroup ],
    );

    const removeOldStrategyFilters = useCallback(
        (id: string) => {
            const newFilterProps = filterProps.filter((fp) => fp.categoryId !== id);

            setFilterProps(newFilterProps);
        },
        [ filterProps ],
    );

    useEffect(
        () => {
            const flatteredStrategyFilters = filterProps.flatMap((s) => s.strategies);

            setStrategyFilters(uniq(flatteredStrategyFilters));
            setCurrentCurrentStrategyFilters(filterProps);
        },
        [ filterProps, setStrategyFilters ],
    );

    const updateStrategyFilters = useCallback(
        (id: string, node: ICategoryStrategiesTypes) => {
            const strategyFilterToFind = currentStrategyFilters.find(({ categoryId }) => categoryId === id);
            if (isNil(strategyFilterToFind)) {
                addNewStrategyFilters(id, node);
            } else {
                removeOldStrategyFilters(id);
            }
        },
        [ addNewStrategyFilters, currentStrategyFilters, removeOldStrategyFilters ],
    );

    const handleTreeLabelClick = useCallback((node: ICategoryStrategiesTypes) => {
        const filter = possibleFilters.find(({ value }) => value.toString() === node.id.toString());
        const category = categoriesFlat.find(({ id }) => id.toString() === node.id.toString());

        if (isNil(filter)) {
            return;
        }

        onCategoryClick(filter);
        updateBreadcrumb(category, categoriesFlat);
        updateStrategyFilters(node.id, node);
    }, [ possibleFilters, categoriesFlat, onCategoryClick, updateBreadcrumb, updateStrategyFilters ]);

    return (
        <div className={className as string}>
            <Heading
              type={HeadingType.small}
              className={styles.heading}
            >
                Category
            </Heading>
            <Tree
              items={categories}
              onSelect={handleTreeLabelClick}
              defaultSelected={defaultSelected}
              defaultExpanded={defaultExpanded}
              treeItemHasTooltip
            />
        </div>
    );
};

export default ContestCategories;
