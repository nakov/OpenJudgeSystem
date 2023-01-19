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
    const [ currentStrategyFilters, setCurrentStrategyFilters ] = useState(defaultState.state.currentStrategyFilters);
    const [ filterProps, setFilterProps ] = useState(defaultState.state.filterProps);
    const [ currentCategoryId, selectCurrentCategoryId ] = useState<string>('');
    const [ prevCategoryId, setPrevCategoryId ] = useState<string>('');

    const categoriesFlat = useMemo(
        () => flattenWith(categories, (c) => c.children || null),
        [ categories ],
    );

    const getCategoryId = useCallback(
        (searchedId?: string, searchedValue?: string) => {
            const filterToFind = possibleFilters
                .find(({ id, value }) => id.toString() === searchedId || value === searchedValue?.toString()) as IFilter;

            if (isNil(filterToFind)) {
                return '';
            }

            const { value } = filterToFind;

            return value;
        },
        [ possibleFilters ],
    );

    const getCurrentNode = useCallback(
        (searchId?: string, searchValue?: string) => {
            const categoryId = getCategoryId(searchId, searchValue);

            return categoriesFlat.find(({ id }) => id.toString() === categoryId);
        },
        [ categoriesFlat, getCategoryId ],
    );

    const getParents = useCallback(
        (result: string[], allItems: ITreeItemType[], searchId?: string, searchValue?: string) => {
            if (isNil(searchId)) {
                return result;
            }

            const currentNode = getCurrentNode(searchId, searchValue);

            if (isNil(currentNode)) {
                return result;
            }

            result.push(currentNode.id.toString());

            getParents(result, allItems, '', currentNode.parentId?.toString());

            return result;
        },
        [ getCurrentNode ],
    );

    const defaultExpanded = useMemo(
        () => getParents([], categoriesFlat, defaultSelected),
        [ defaultSelected, categoriesFlat, getParents ],
    );

    const strategyFilterGroup = useMemo(
        () => possibleFilters.filter(({ type }) => type === FilterType.Strategy),
        [ possibleFilters ],
    );

    const getStrategyFiltersToAdd = useCallback(
        ({ allowedStrategyTypes }: ICategoryStrategiesTypes) => allowedStrategyTypes
            ?.map((value) => value.id.toString())
            .map((x) => strategyFilterGroup.find((y) => y.value === x))
            .filter((x) => !isNil(x)) as IFilter[],
        [ strategyFilterGroup ],
    );

    const addNewStrategyFilters = useCallback(
        (id: string, node: ICategoryStrategiesTypes) => {
            const strategyFiltersToAdd = getStrategyFiltersToAdd(node);

            setFilterProps([ { categoryId: id, strategies: strategyFiltersToAdd } ]);
        },
        [ getStrategyFiltersToAdd ],
    );

    const removeOldStrategyFilters = useCallback(
        () => {
            setFilterProps([]);
        },
        [],
    );

    useEffect(
        () => {
            const flatteredStrategyFilters = filterProps.flatMap((s) => s.strategies);

            setStrategyFilters(uniq(flatteredStrategyFilters));
            setCurrentStrategyFilters(filterProps);
        },
        [ filterProps, setStrategyFilters ],
    );

    const updateStrategyFilters = useCallback(
        (id: string, node: ICategoryStrategiesTypes) => {
            const strategyFilterToUpdate = currentStrategyFilters.find(({ categoryId }) => categoryId === id);

            (isNil(strategyFilterToUpdate)
                ? addNewStrategyFilters
                : removeOldStrategyFilters)(id, node);

            setPrevCategoryId(id);
        },
        [ addNewStrategyFilters, currentStrategyFilters, removeOldStrategyFilters ],
    );

    const handleTreeLabelClick = useCallback((node: ICategoryStrategiesTypes) => {
        const filter = possibleFilters.find(({ value }) => value.toString() === node.id.toString());
        const category = categoriesFlat.find(({ id }) => id.toString() === node.id.toString());

        if (isNil(filter)) {
            return;
        }
        updateBreadcrumb(category, categoriesFlat);
        updateStrategyFilters(node.id, node);
        selectCurrentCategoryId(node.id);
        onCategoryClick(filter);
    }, [ possibleFilters, categoriesFlat, updateBreadcrumb, updateStrategyFilters, onCategoryClick ]);

    useEffect(
        () => {
            const currentNode = getCurrentNode(defaultSelected);

            if (isNil(currentNode)) {
                return;
            }

            selectCurrentCategoryId(currentNode?.id);
        },
        [ defaultSelected, getCurrentNode ],
    );

    useEffect(
        () => {
            if (currentCategoryId && currentCategoryId !== prevCategoryId) {
                const categoryId = getCategoryId('', currentCategoryId);
                const category = categoriesFlat.find(({ id }) => id.toString() === categoryId) as ITreeItemType;
                if (isNil(category)) {
                    return;
                }

                handleTreeLabelClick(category);

                setPrevCategoryId(currentCategoryId);
            }
        },
        [ categoriesFlat, currentCategoryId, getCategoryId, handleTreeLabelClick, prevCategoryId ],
    );

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
              defaultSelected={getCategoryId(defaultSelected)}
              defaultExpanded={defaultExpanded}
              treeItemHasTooltip
            />
        </div>
    );
};

export default ContestCategories;
