import React, { useCallback, useEffect, useState } from 'react';
import { TreeItem, TreeView } from '@material-ui/lab';
import { MdChevronRight, MdExpandMore } from 'react-icons/md';
import { isArray, isEmpty } from 'lodash';

import concatClassNames from '../../../utils/class-names';
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
}: ITreeProps) => {
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

    const categoriesTree = 'tree-Header';
    const categoriesTreeClassName = concatClassNames(categoriesTree, styles.categoriesTree);
    const treeElement = 'tree-Element';
    const treeElementClassName = concatClassNames(treeElement, styles.treeElement);
    const treeTooltip = 'tooltip';
    const treeTooltipClassName = concatClassNames(treeTooltip, styles.tooltip);
    const treeTooltipElement = 'tooltip-Element';
    const treeTooltipElementClassName = concatClassNames(treeTooltipElement, styles.tooltipElement);

    const renderTree = useCallback((node: ITreeItemType) => (
        <div className={categoriesTreeClassName}>
            <div className={treeTooltipClassName}>
                <div className={treeTooltipElementClassName}
                     key={node.id}>
                    {node.name}
                </div>
            </div>
            <TreeItem
                key={node.id}
                className={treeElementClassName}
                nodeId={node.id.toString()}
                label={node.name}
                onClick={() => handleTreeItemClick(node)}
                onLabelClick={() => handleLabelClick(node)}
            >
                {isArray(node.children)
                    ? node.children.map((child) => renderTree(child))
                    : null}
            </TreeItem>
        </div>
    ), [ categoriesTreeClassName, treeTooltipClassName, treeTooltipElementClassName,
        treeElementClassName, handleLabelClick, handleTreeItemClick ]);

    const renderTreeView = (treeItems: ITreeItemType[]) => treeItems.map((c) => renderTree(c));

    return (
        <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<MdExpandMore/>}
            defaultExpandIcon={<MdChevronRight/>}
            selected={selected}
            expanded={expanded}
        >
            <div className={treeTooltipClassName}> {renderTreeView(items)}</div>
            {renderTreeView(items)}
        </TreeView>
    );
};

export default Tree;

export type {
    ITreeItemType,
};
