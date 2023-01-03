import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import ICategoryStrategiesTypes from '../../../common/category-strategies-types';
import { Anything } from '../../../common/common-types';
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

const ContestCategories = ({
    className = '',
    onCategoryClick,
    defaultSelected,
    setStrategyFilters,
}: IContestCategoriesProps) => {
    const { state: { categories } } = useContestCategories();
    const { state: { possibleFilters } } = useContests();
    const { actions: { updateBreadcrumb } } = useCategoriesBreadcrumbs();
    const [ currentStrategyFilters, setCurrentCurrentStrategyFilters ] = useState([] as IFilterProps[]);

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

    const handleTreeLabelClick = useCallback((node: ICategoryStrategiesTypes) => {
        const filter = possibleFilters.find(({ value }) => value.toString() === node.id.toString());
        const category = categoriesFlat.find(({ id }) => id.toString() === node.id.toString());

        if (isNil(filter)) {
            return;
        }

        onCategoryClick(filter);
        updateBreadcrumb(category, categoriesFlat);
    }, [ possibleFilters, categoriesFlat, onCategoryClick, updateBreadcrumb ]);

    const strategyFilterGroup = useMemo(
        () => possibleFilters.filter(({ type }) => type === FilterType.Strategy),
        [ possibleFilters ],
    );

    const filterProps = useMemo(
        () => [] as any,
        [],
    );

    const addNewStrategyFilters = useCallback(
        (id: string, node: ICategoryStrategiesTypes) => {
            const strategyFiltersToAdd: IFilter[] = [];
            node.allowedStrategyTypes.forEach((value) => {
                const currAllowedStrategyId = value.id.toString();

                const strategyToFind = strategyFilterGroup.find((x) => x.value === currAllowedStrategyId);

                if (!isNil(strategyToFind)) {
                    strategyFiltersToAdd.push(strategyToFind);
                }
            });

            filterProps.push({
                categoryId: id,
                strategies: strategyFiltersToAdd,
            });

            const flatteredStrategyFilters = filterProps.flatMap((s: Anything) => s.strategies);

            setCurrentCurrentStrategyFilters(filterProps);

            setStrategyFilters(Array.from(new Set(flatteredStrategyFilters)));
        },
        [ filterProps, setStrategyFilters, strategyFilterGroup ],
    );

    const removeOldStrategyFilters = useCallback(
        (id: string) => {
            const strategyFilterToFind = filterProps.find((fp : Anything) => fp.categoryId === id);

            filterProps.splice(strategyFilterToFind, 1);

            const flatteredStrategyFilters = filterProps.flatMap((s: Anything) => s.strategies);

            setStrategyFilters(flatteredStrategyFilters);
        },
        [ filterProps, setStrategyFilters ],
    );

    const strategyFilters = useCallback(
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
              onTreeItemClick={strategyFilters}
            />
        </div>
    );
};

export default ContestCategories;
