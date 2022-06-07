import React, { useCallback, useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@material-ui/lab';
import { MdChevronRight, MdExpandMore } from 'react-icons/md';
import { isArray } from 'lodash';

import styles from './Tree.module.scss';

interface ITreeItemType {
    id: string,
    name: string,
    parentId?: string,
    children?: ITreeItemType[],
}

interface ITreeProps {
    items: ITreeItemType[];
    onTreeItemClick: (node: ITreeItemType) => void;
    defaultExpanded?: string[];
    defaultSelected?: string[];
}

const Tree = ({
    items,
    onTreeItemClick,
    defaultExpanded = [],
    defaultSelected = [],
} : ITreeProps) => {
    const [ expanded, setExpanded ] = useState([] as string[]);
    const [ selected, setSelected ] = useState([] as string[]);

    const handleTreeItemClick = useCallback(
        (node: ITreeItemType) => {
            const id = node.id.toString();

            if (selected.includes(id)) {
                const newSelected = selected.filter((e) => e !== id);
                setExpanded(newSelected);
            } else {
                selected.push(id);
                setSelected(selected);
            }

            if (expanded.includes(id)) {
                const newExpanded = expanded.filter((e) => e !== id);
                setExpanded(newExpanded);
            } else {
                expanded.push(id);
                setExpanded(expanded);
            }

            onTreeItemClick(node);
        },
        [ expanded, selected, onTreeItemClick ],
    );

    useEffect(
        () => {
            if (defaultSelected) {
                setSelected(defaultSelected);
            }
        },
        [ defaultSelected ],
    );

    useEffect(
        () => {
            if (defaultExpanded) {
                setExpanded(defaultExpanded);
            }
        },
        [ defaultExpanded ],
    );

    const renderTree = useCallback((node: ITreeItemType) => (
        <TreeItem
          key={node.id}
          nodeId={node.id.toString()}
          label={node.name}
          onClick={() => handleTreeItemClick(node)}
        >
            {isArray(node.children)
                ? node.children.map((child) => renderTree(child))
                : null}
        </TreeItem>
    ), [ handleTreeItemClick ]);

    const renderTreeView = (treeItems: ITreeItemType[]) => treeItems.map((c) => renderTree(c));

    return (
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<MdExpandMore />}
          defaultExpandIcon={<MdChevronRight />}
          expanded={expanded}
          selected={selected}
          className={styles.root}
        >
            {renderTreeView(items)}
        </TreeView>
    );
};

export default Tree;

export type {
    ITreeItemType,
};
