import React, { useCallback } from 'react';
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
    expanded?: string[];
    selected?: string[];
}

const Tree = ({
    items,
    onTreeItemClick,
    expanded = [] as string[],
    selected = [] as string[],
} : ITreeProps) => {
    const renderTree = useCallback((node: ITreeItemType) => (
        <TreeItem
          key={node.id}
          nodeId={node.id.toString()}
          label={node.name}
          onClick={() => onTreeItemClick(node)}
        >
            {isArray(node.children)
                ? node.children.map((child) => renderTree(child))
                : null}
        </TreeItem>
    ), [ onTreeItemClick ]);

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
