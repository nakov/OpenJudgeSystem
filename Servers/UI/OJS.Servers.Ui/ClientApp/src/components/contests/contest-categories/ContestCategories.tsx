import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import ICategoryStrategiesTypes from '../../../common/category-strategies-types';
import { FilterType, IFilter } from '../../../common/contest-types';
import ITreeItemType from '../../../common/tree-types';
import { useContestCategories } from '../../../hooks/use-contest-categories';
import { useCategoriesBreadcrumbs } from '../../../hooks/use-contest-categories-breadcrumb';
import { useContests } from '../../../hooks/use-contests';
import concatClassNames from '../../../utils/class-names';
import { IHaveOptionalClassName } from '../../common/Props';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import Tree from '../../guidelines/trees/Tree';

import styles from './ContestCategories.module.scss';

interface IContestCategoriesProps extends IHaveOptionalClassName {
    onCategoryClick: (filter: IFilter) => void;
    defaultSelected: string;
    setStrategyFilters: Dispatch<SetStateAction<IFilter[]>>;
    isClearFiltersButtonClicked: boolean;
}

interface IFilterProps {
    categoryId: string;
    strategies: IFilter[];
}

const defaultState = {
    state: {
        openedCategoryFilters: [] as IFilterProps[],
        openedCategoryFilter: {} as IFilterProps,
    },
};
const ContestCategories = ({
    className = '',
    onCategoryClick,
    defaultSelected,
    setStrategyFilters,
    isClearFiltersButtonClicked,
}: IContestCategoriesProps) => {
    const { state: { categories, categoriesFlat } } = useContestCategories();
    const { state: { possibleFilters } } = useContests();
    const { actions: { updateBreadcrumb, clearBreadcrumb } } = useCategoriesBreadcrumbs();
    const [ openedCategoryFilters, setOpenedCategoryFilters ] = useState(defaultState.state.openedCategoryFilters);
    const [ openedCategoryFilter, setOpenedCategoryFilter ] = useState(defaultState.state.openedCategoryFilter);
    const [ currentCategoryId, selectCurrentCategoryId ] = useState<string>('');
    const [ prevCategoryId, setPrevCategoryId ] = useState<string>('');
    const ref = useRef<any>();

    useEffect(() => {
        if (ref.current) {
            ref.current.clearTreeIds();
        }
    }, [ isClearFiltersButtonClicked ]);

    const getCategoryByValue = useCallback(
        (searchedValue?: string) => {
            const filterToFind = possibleFilters
                .find(({ value }) => value === searchedValue?.toString()) as IFilter;

            if (isNil(filterToFind)) {
                return '';
            }

            const { value } = filterToFind;

            return value;
        },
        [ possibleFilters ],
    );

    const getCategoryById = useCallback(
        (searchedValue: string) => {
            const filterToFind = possibleFilters
                .find(({ value }) => value.toString() === searchedValue) as IFilter;

            if (isNil(filterToFind)) {
                return '';
            }

            const { value } = filterToFind;

            return value;
        },
        [ possibleFilters ],
    );

    const getCurrentNode = useCallback(
        (searchId: string | null, searchValue?: string) => {
            const categoryValue = isNil(searchId)
                ? getCategoryByValue(searchValue)
                : getCategoryById(searchId);

            return categoriesFlat.find(({ id }) => id.toString() === categoryValue);
        },
        [ categoriesFlat, getCategoryById, getCategoryByValue ],
    );

    const getParents = useCallback(
        (result: string[], allItems: ITreeItemType[], searchId: string | null, searchValue?: string) => {
            const currentNode = getCurrentNode(searchId, searchValue);

            if (isNil(currentNode)) {
                return result;
            }

            result.push(currentNode.id.toString());

            getParents(result, allItems, null, currentNode.parentId?.toString());

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

            setOpenedCategoryFilters([
                ...openedCategoryFilters,
                { categoryId: id, strategies: strategyFiltersToAdd },
            ]);

            setOpenedCategoryFilter({ categoryId: id, strategies: strategyFiltersToAdd });
        },
        [ getStrategyFiltersToAdd, openedCategoryFilters ],
    );

    const removeChild = useCallback(
        (child: ICategoryStrategiesTypes, elementsToRemove: IFilterProps[]) => {
            const childToRemove = openedCategoryFilters.find((osf) => osf.categoryId === child.id);
            if (!isNil(childToRemove)) {
                elementsToRemove.push(childToRemove);
            }
        },
        [ openedCategoryFilters ],
    );

    const findAllChildren = useCallback(
        (node: ICategoryStrategiesTypes, elementsToRemove: IFilterProps[]) => {
            node.children?.forEach((child) => {
                findAllChildren(child, elementsToRemove);

                removeChild(child, elementsToRemove);
            });
        },
        [ removeChild ],
    );

    const removeOldStrategyFilters = useCallback(
        (id: string, node: ICategoryStrategiesTypes) => {
            const elementsToRemove: IFilterProps[] = [];

            const nodeToRemove = openedCategoryFilters.find((osf) => osf.categoryId === id) as IFilterProps;

            elementsToRemove.push(nodeToRemove);

            findAllChildren(node, elementsToRemove);

            const strategyFiltersToAdd = getStrategyFiltersToAdd(node);

            const newFilterProps = openedCategoryFilters.filter((categoryId) => !elementsToRemove.includes(categoryId));

            setOpenedCategoryFilters(newFilterProps);

            setOpenedCategoryFilter({ categoryId: id, strategies: strategyFiltersToAdd });
        },
        [ findAllChildren, getStrategyFiltersToAdd, openedCategoryFilters ],
    );

    const updateStrategyFilters = useCallback(
        (id: string, node: ICategoryStrategiesTypes) => {
            const strategyFilterToUpdate = openedCategoryFilters.find(({ categoryId }) => categoryId === id);

            (isNil(strategyFilterToUpdate)
                ? addNewStrategyFilters
                : removeOldStrategyFilters)(id, node);

            setPrevCategoryId(id);
        },
        [ addNewStrategyFilters, openedCategoryFilters, removeOldStrategyFilters ],
    );

    const handleTreeLabelClick = useCallback(
        (node: ICategoryStrategiesTypes) => {
            const filter = possibleFilters.find(({ value }) => value.toString() === node.id.toString());
            const category = categoriesFlat.find(({ id }) => id.toString() === node.id.toString());

            if (isNil(filter)) {
                return;
            }

            updateBreadcrumb(category, categoriesFlat);
            updateStrategyFilters(node.id, node);
            selectCurrentCategoryId(node.id);

            onCategoryClick(filter);
        },
        [ categoriesFlat, onCategoryClick, possibleFilters, updateBreadcrumb, updateStrategyFilters ],
    );

    const applyStrategyFilters = useCallback(
        () => {
            const categoryValue = getCategoryByValue(currentCategoryId);
            const category = categoriesFlat.find(({ id }) => id.toString() === categoryValue) as ITreeItemType;
            if (isNil(category)) {
                return;
            }

            handleTreeLabelClick(category);

            setPrevCategoryId(currentCategoryId);
        },
        [ categoriesFlat, currentCategoryId, getCategoryByValue, handleTreeLabelClick ],
    );

    useEffect(
        () => {
            if (isEmpty(openedCategoryFilters)) {
                clearBreadcrumb();
                setStrategyFilters([]);
            } else {
                setStrategyFilters(openedCategoryFilter.strategies);
            }
        },
        [ clearBreadcrumb, openedCategoryFilter.strategies, openedCategoryFilters, setStrategyFilters ],
    );

    useEffect(
        () => {
            if (currentCategoryId && currentCategoryId !== prevCategoryId) {
                applyStrategyFilters();
            }
        },
        [ applyStrategyFilters, currentCategoryId, prevCategoryId ],
    );

    return (
        <div className={concatClassNames(className)}>
            <Heading
              type={HeadingType.small}
              className={styles.heading}
            >
                Category
            </Heading>
            <Tree
              items={categories}
              onSelect={handleTreeLabelClick}
              defaultSelected={getCategoryById(defaultSelected)}
              defaultExpanded={defaultExpanded}
              treeItemHasTooltip
              ref={ref}
            />
        </div>
    );
};

export default ContestCategories;
