import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import without from 'lodash/without';

import ITreeItemType from '../../../common/tree-types';
import ExpandMoreIcon from '../icons/ExpandMoreIcon';
import RightArrowIcon from '../icons/RightArrowIcon';

import styles from './Tree.module.scss';

interface ITreeProps {
    items: ITreeItemType[];
    onSelect: (node: ITreeItemType) => void;
    defaultSelected?: string;
    defaultExpanded?: string[];
    itemFunc?: (item: ITreeItemType) => React.ReactElement;
    treeItemHasTooltip?: boolean;
}

const Tree = ({
    items,
    onSelect,
    defaultSelected = '',
    defaultExpanded = [],
    itemFunc,
    treeItemHasTooltip = false,
}: ITreeProps) => {
    const [ expandedIds, setExpandedIds ] = useState([] as string[]);
    const [ selectedId, setSelectedId ] = useState('');

    const handleTreeItemClick = useCallback(
        (node: ITreeItemType) => {
            const id = node.id.toString();
            const newExpanded = expandedIds.includes(id)
                ? without(expandedIds,id)
                : [ ...expandedIds,id ];

            setExpandedIds(newExpanded);
        },
        [ expandedIds, setExpandedIds ],
    );

    const handleLabelClick = useCallback(
        (node: ITreeItemType) => {
            setSelectedId(node.id.toString());

            onSelect(node);
        },
        [ onSelect ],
    );

    const renderTooltip = useCallback((node: ITreeItemType) => (
        <div className={styles.tooltip}>
            {node.name}
        </div>
    ),[]);
    
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
                ? node.children.map((child) =>
                    treeItemHasTooltip
                        ? (<div className={styles.Tree} key={child.id}>
                            {renderTooltip(child)}
                            {renderTreeItem(child)}
                        </div>)
                        : renderTreeItem(child))
                : null}
        </TreeItem>
    ), [ handleLabelClick, handleTreeItemClick, renderTooltip, treeItemHasTooltip ]);



    const defaultItemFunc = useCallback(
        (node: ITreeItemType) => 
            treeItemHasTooltip
                ? (<div className={styles.Tree} key={node.id}>
                    {renderTooltip(node)}
                    {renderTreeItem(node)}
                </div>)
                : renderTreeItem(node),
        [ renderTooltip, renderTreeItem, treeItemHasTooltip ],
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
