import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import without from 'lodash/without';

import { FilterType, IFilter } from '../../../common/contest-types';
import ITreeItemType from '../../../common/tree-types';
import { useContests } from '../../../hooks/use-contests';
import ExpandMoreIcon from '../icons/ExpandMoreIcon';
import RightArrowIcon from '../icons/RightArrowIcon';

import styles from './Tree.module.scss';

interface ITreeProps {
    items: ITreeItemType[];
    setStrategyFilters: Dispatch<SetStateAction<IFilter[]>>;
    onSelect: (node: ITreeItemType) => void;
    defaultSelected?: string;
    defaultExpanded?: string[];
    itemFunc?: (item: ITreeItemType) => React.ReactElement;
    treeItemHasTooltip?: boolean;
}

interface IFilterProps {
    categoryId: string;
    strategies: IFilter[];
}

const Tree = ({
    items,
    setStrategyFilters,
    onSelect,
    defaultSelected = '',
    defaultExpanded = [],
    itemFunc,
    treeItemHasTooltip = false,
}: ITreeProps) => {
    const [ expandedIds, setExpandedIds ] = useState([] as string[]);
    const [ currentStrategyFilters, setCurrentCurrentStrategyFilters ] = useState([] as IFilterProps[]);
    const [ selectedId, setSelectedId ] = useState('');
    const { state: { possibleFilters } } = useContests();

    const strategyFilterGroup = useMemo(
        () => possibleFilters.filter(({ type }) => type === FilterType.Strategy),
        [ possibleFilters ],
    );

    const newStrategyFilters = useCallback(
        (id: string, node: ITreeItemType) => {
            const filterProps = [];
            // clicking the category again - removing strategies with this type
            if (currentStrategyFilters.map((csf) => csf.categoryId).includes(id)) {
                currentStrategyFilters.filter((csf) => csf.categoryId !== id);
            } else {
                // adding new
                const strategyFiltersToAdd : IFilter[] = [];
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
            }

            // getting all Strategies from the array
            const strategyFilters = filterProps.flatMap((s) => s.strategies)
                .reduce((strategyFilter: IFilter[], currentStrategyFilter) => {
                    strategyFilter.push(currentStrategyFilter);
                    return strategyFilter;
                }, []);

            // set the new Strategies
            setCurrentCurrentStrategyFilters(filterProps);

            // setter from parent
            setStrategyFilters(strategyFilters);
        },
        [ currentStrategyFilters, setStrategyFilters, strategyFilterGroup ],
    );

    const handleTreeItemClick = useCallback(
        (node: ITreeItemType) => {
            const id = node.id.toString();
            const newExpanded = expandedIds.includes(id)
                ? without(expandedIds, id)
                : [ ...expandedIds, id ];

            newStrategyFilters(id, node);

            setExpandedIds(newExpanded);
        },
        [ expandedIds, newStrategyFilters ],
    );

    const handleLabelClick = useCallback(
        (node: ITreeItemType) => {
            setSelectedId(node.id.toString());
            onSelect(node);
        },
        [ onSelect ],
    );

    const renderTreeItem = useCallback((node: ITreeItemType) => (
        <TreeItem
          className={styles.treeElement}
          key={node.id}
          nodeId={node.id.toString()}
          label={node.name}
          onClick={() => handleTreeItemClick(node)}
          onLabelClick={() => handleLabelClick(node)}
        >
            {isArray(node.children)
                ? node.children.map((child) => treeItemHasTooltip
                    ? (
                        <div className={styles.childrenElements} key={child.id}>
                            {renderTreeItem(child)}
                        </div>
                    )
                    : renderTreeItem(child))
                : null}
        </TreeItem>
    ), [ handleLabelClick, handleTreeItemClick, treeItemHasTooltip ]);

    const defaultItemFunc = useCallback(
        (node: ITreeItemType) => treeItemHasTooltip
            ? (
                <div className={styles.Tree} key={node.id}>
                    {renderTreeItem(node)}
                </div>
            )
            : renderTreeItem(node),
        [ renderTreeItem, treeItemHasTooltip ],
    );

    const itemFuncInternal = useMemo(
        () => isNil(itemFunc)
            ? defaultItemFunc
            : itemFunc,
        [ defaultItemFunc, itemFunc ],
    );

    useEffect(
        () => {
            if (isEmpty(selectedId) && defaultSelected) {
                setSelectedId(defaultSelected);
            }
        },
        [ defaultSelected, selectedId ],
    );

    useEffect(
        () => {
            if (isEmpty(expandedIds) && !isEmpty(defaultExpanded)) {
                setExpandedIds(defaultExpanded);
            }
        },
        [ defaultExpanded, expandedIds ],
    );

    const renderTreeView = (treeItems: ITreeItemType[]) => treeItems.map((c) => itemFuncInternal(c));

    return (
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<RightArrowIcon />}
          selected={selectedId}
          expanded={expandedIds}
        >
            {renderTreeView(items)}
        </TreeView>
    );
};

export default Tree;

export type {
    ITreeProps,
};
