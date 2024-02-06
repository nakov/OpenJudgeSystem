import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import ICategoryStrategiesTypes from '../../../common/category-strategies-types';
import { FilterType, IFilter } from '../../../common/contest-types';
import ITreeItemType from '../../../common/tree-types';
import { useContestCategories } from '../../../hooks/use-contest-categories';
import { useCategoriesBreadcrumbs } from '../../../hooks/use-contest-categories-breadcrumb';
import { useContests } from '../../../hooks/use-contests';
import useTheme from '../../../hooks/use-theme';
import { useGetContestCategoriesQuery } from '../../../redux/services/contestsService';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import { IHaveOptionalClassName } from '../../common/Props';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';

import styles from './ContestCategories.module.scss';

interface IContestCategoriesProps extends IHaveOptionalClassName {
    onCategoryClick: (filter: IFilter) => void;
    setStrategyFilters: Dispatch<SetStateAction<IFilter[]>>;
    shouldReset: boolean;
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
    onCategoryClick,
    setStrategyFilters,
    shouldReset,
}: IContestCategoriesProps) => {
    const { themeColors } = useTheme();
    const { state: { categories, categoriesFlat } } = useContestCategories();
    const { state: { possibleFilters } } = useContests();
    const { actions: { updateBreadcrumb, clearBreadcrumb } } = useCategoriesBreadcrumbs();
    const [ openedCategoryFilters, setOpenedCategoryFilters ] = useState(defaultState.state.openedCategoryFilters);
    const [ openedCategoryFilter, setOpenedCategoryFilter ] = useState(defaultState.state.openedCategoryFilter);
    const [ currentCategoryId, selectCurrentCategoryId ] = useState<string>('');
    const [ prevCategoryId, setPrevCategoryId ] = useState<string>('');
    const [ isExpanded, setIsExpanded ] = useState<boolean>(true);

    const {
        data: contestCategories,
        isLoading: areCategoriesLoading,
        error: categoriesError,
    } = useGetContestCategoriesQuery();

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

    useEffect(() => {
        setOpenedCategoryFilters(defaultState.state.openedCategoryFilters);
        setOpenedCategoryFilter(defaultState.state.openedCategoryFilter);
        selectCurrentCategoryId('');
        setPrevCategoryId('');
        clearBreadcrumb();
    }, [ shouldReset, clearBreadcrumb ]);

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

    const renderContestCategories = useCallback(() => {
        console.log('contest categories => ', contestCategories);
        return (
            <div className={styles.categoriesTreeWrapper} style={{ color: themeColors.textColor }}>
                {contestCategories.map((category: any, idx: number) => {
                    const isLast = idx === contestCategories.length - 1;
                    return (
                        <div
                          key={`c-c-${category.id}`}
                          className={styles.categoryTreeItemWrapper}
                          style={{ borderBottom: `2px solid ${themeColors.baseColor100}` }}
                        >
                            <i className="far fa-file-alt" />
                            <div className={styles.categoryTreeItem} onClick={() => onCategoryClick(category.name)}>
                                {category.name}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }, [ contestCategories ]);

    if (categoriesError) {
        return (<div>Error loading contest categories. Please try again.</div>);
    }

    return (
        <div className={styles.contestCategoriesWrapper}>
            {/*
                eslint-disable-next-line
                jsx-a11y/click-events-have-key-events,
                jsx-a11y/no-static-element-interactions
             */}
            <div
              className={styles.contestCategoriesHeading}
              style={{ color: themeColors.textColor }}
              onClick={() => setIsExpanded(!isExpanded)}
            >
                Contest Categories
                <i className={`fas ${isExpanded
                    ? 'fa-angle-up'
                    : 'fa-angle-down'}`}
                />
            </div>
            {areCategoriesLoading
                ? <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>
                : <div>{renderContestCategories()}</div>}
        </div>
    );
};

export default ContestCategories;
