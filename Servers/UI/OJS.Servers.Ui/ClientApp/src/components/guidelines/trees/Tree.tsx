import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import without from 'lodash/without';

import ITreeItemType from '../../../common/tree-types';
import { useContestCategories } from '../../../hooks/use-contest-categories';
import { useCategoriesBreadcrumbs } from '../../../hooks/use-contest-categories-breadcrumb';
import ExpandMoreIcon from '../icons/ExpandMoreIcon';
import RightArrowIcon from '../icons/RightArrowIcon';

import styles from './Tree.module.scss';

interface ITreeProps {
    items: ITreeItemType[];
    onSelect: (node: ITreeItemType) => void;
    defaultSelected: string;
    defaultExpanded?: string[];
    itemFunc?: (item: ITreeItemType) => React.ReactElement;
    treeItemHasTooltip?: boolean;
}

const Tree = forwardRef(({
    items,
    onSelect,
    defaultSelected = '',
    defaultExpanded = [],
    itemFunc,
    treeItemHasTooltip = false,
}: ITreeProps, ref: any) => {
    const { search } = useLocation();
    const [ expandedIds, setExpandedIds ] = useState([] as string[]);
    const [ selectedId, setSelectedId ] = useState('');
    const [ selectedFromUrl, setSelectedFromUrl ] = useState(true);
    const { state: { selectedBreadcrumbCategoryId }, actions: { updateBreadcrumb, clearBreadcrumb } } = useCategoriesBreadcrumbs();
    const { state: { categoriesFlat } } = useContestCategories();

    useImperativeHandle(ref, () => ({
        clearTreeIds() {
            setExpandedIds([]);
        },
    }));

    useEffect(() => {
        if (!search) {
            setExpandedIds([]);
            clearBreadcrumb();
        }
    }, [ search, clearBreadcrumb ]);

    useEffect(() => {
        setExpandedIds([]);
        clearBreadcrumb();
    }, [ clearBreadcrumb ]);

    useEffect(
        () => {
            if (isEmpty(selectedId) && selectedFromUrl) {
                setSelectedId(defaultSelected);

                const category = categoriesFlat.find(({ id }) => id.toString() === defaultSelected) as ITreeItemType;
                updateBreadcrumb(category, categoriesFlat);
            }
        },
        [ defaultSelected, selectedFromUrl, selectedId, updateBreadcrumb, categoriesFlat ],
    );

    useEffect(
        () => {
            if (isEmpty(expandedIds) && selectedFromUrl) {
                setExpandedIds(defaultExpanded);
            }
        },
        [ defaultExpanded, expandedIds, selectedFromUrl ],
    );

    const handleTreeItemClick = useCallback(
        (node: ITreeItemType) => {
            const id = node.id.toString();
            const newExpanded = expandedIds.includes(id)
                ? without(expandedIds, id)
                : [ ...expandedIds, id ];

            setExpandedIds(newExpanded);
            setSelectedFromUrl(false);

            setSelectedId(node.id.toString());
            onSelect(node);
        },
        [ expandedIds, onSelect ],
    );

    const renderTreeItem = useCallback((node: ITreeItemType) => (
        <TreeItem
          className={styles.treeElement}
          key={node.id}
          nodeId={node.id.toString()}
          label={node.name}
          onClick={() => handleTreeItemClick(node)}
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
    ), [ handleTreeItemClick, treeItemHasTooltip ]);

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

    const renderTreeView = useCallback(
        (treeItems: ITreeItemType[]) => treeItems.map((c) => itemFuncInternal(c)),
        [ itemFuncInternal ],
    );

    const renderTree = useCallback(
        () => {
            if (selectedBreadcrumbCategoryId !== selectedId && !selectedFromUrl) {
                setSelectedId(selectedBreadcrumbCategoryId);
            }

            return (
                <TreeView
                  aria-label="rich object"
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<RightArrowIcon />}
                  selected={selectedId.toString()}
                  expanded={expandedIds}
                >
                    {renderTreeView(items)}
                </TreeView>
            );
        },
        [ expandedIds, renderTreeView, items, selectedBreadcrumbCategoryId, selectedId, selectedFromUrl ],
    );

    return renderTree();
});

export default Tree;

export type {
    ITreeProps,
};
