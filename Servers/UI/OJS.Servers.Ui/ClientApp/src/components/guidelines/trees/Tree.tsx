import React, { useCallback, useEffect, useState } from 'react';
import { TreeItem, TreeView } from '@material-ui/lab';
import { isArray, isEmpty, without } from 'lodash';
import MdExpandMoreIcon from '../icons/MdExpandMoreIcon';
import MdChevronRightIcon from '../icons/MdChervronRightIcon';
import ITreeItemType from '../../../common/tree-types';

interface ITreeProps {
    items: ITreeItemType[];
    onCategoryLabelClick: (node: ITreeItemType) => void;
    defaultSelected?: string;
    defaultExpanded?: string[];
}

const Tree = ({
    items,
    onCategoryLabelClick,
    defaultSelected,
    defaultExpanded = [],
}: ITreeProps) => {
    const [ expandedIds, setExpandedIds ] = useState([] as string[]);
    const [ selectedIds, setSelected ] = useState('');

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
            setSelected(node.id.toString());

            onCategoryLabelClick(node);
        },
        [ onCategoryLabelClick ],
    );

    useEffect(
        () => {
            if (isEmpty(selectedIds) && defaultSelected) {
                setSelected(defaultSelected);
            }
        },
        [ defaultSelected, selectedIds ],
    );

    useEffect(
        () => {
            if (isEmpty(expandedIds) && !isEmpty(defaultExpanded)) {
                setExpandedIds(defaultExpanded);
            }
        },
        [ defaultExpanded, expandedIds ],
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
            defaultCollapseIcon={<MdExpandMoreIcon />}
            defaultExpandIcon={<MdChevronRightIcon />}
            selected={selectedIds}
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
