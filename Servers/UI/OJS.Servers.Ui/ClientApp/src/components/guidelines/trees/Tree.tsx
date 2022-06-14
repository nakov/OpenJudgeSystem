import React, { useCallback, useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@material-ui/lab';
import { MdChevronRight, MdExpandMore } from 'react-icons/md';
import { isArray, isEmpty } from 'lodash';

import styles from './Tree.module.scss';

interface ITreeItemType {
    id: string,
    name: string,
    parentId?: string,
    children?: ITreeItemType[],
}

interface ITreeProps {
    items: ITreeItemType[];
    onTreeLabelClick: (node: ITreeItemType) => void;
    defaultSelected?: string;
    defaultExpanded?: string[];
}

const Tree = ({
    items,
    onTreeLabelClick,
    defaultSelected,
    defaultExpanded = [],
} : ITreeProps) => {
    const [ expanded, setExpanded ] = useState([] as string[]);
    const [ selected, setSelected ] = useState('');

    const handleTreeItemClick = useCallback(
        (node: ITreeItemType) => {
            const id = node.id.toString();
            let newExpanded = Array.from(expanded);

            if (expanded.includes(id)) {
                newExpanded = newExpanded.filter((e) => e !== id);
            } else {
                newExpanded.push(id);
            }

            setExpanded(newExpanded);
        },
        [ expanded, setExpanded ],
    );

    const handleLabelClick = useCallback(
        (node: ITreeItemType) => {
            setSelected(node.id.toString());

            onTreeLabelClick(node);
        },
        [ onTreeLabelClick ],
    );

    useEffect(
        () => {
            if (isEmpty(selected) && defaultSelected) {
                setSelected(defaultSelected);
            }
        },
        [ defaultSelected, selected ],
    );

    useEffect(
        () => {
            if (isEmpty(expanded) && !isEmpty(defaultExpanded)) {
                setExpanded(defaultExpanded);
            }
        },
        [ defaultExpanded, expanded ],
    );

    const renderTree = useCallback((node: ITreeItemType) => (
        <TreeItem
          key={node.id}
          nodeId={node.id.toString()}
          label={node.name}
          onClick={() => handleTreeItemClick(node)}
          onLabelClick={() => handleLabelClick(node)}
        >
            {isArray(node.children)
                ? node.children.map((child) => renderTree(child))
                : null}
        </TreeItem>
    ), [ handleLabelClick, handleTreeItemClick ]);

    const renderTreeView = (treeItems: ITreeItemType[]) => treeItems.map((c) => renderTree(c));

    return (
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<MdExpandMore />}
          defaultExpandIcon={<MdChevronRight />}
          selected={selected}
          expanded={expanded}
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
