import React, { useCallback, useEffect, useState } from 'react';
import { TreeItem, TreeView } from '@material-ui/lab';
import { MdChevronRight, MdExpandMore } from 'react-icons/md';
import { isArray, isEmpty } from 'lodash';
import { ITreeItemType, ITreeProps } from '../../common/TreeProviders';

import styles from './CategoriesTree.module.scss';

const CategoryTree = ({
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
    
    const renderCategoryTree = useCallback((node: ITreeItemType) => (
        <div className={styles.categoriesTree}>
            <div className={styles.tooltip}>
                <div className={styles.tooltipElement}
                     >
                    {node.name}
                </div>
            </div>
            <TreeItem
                key={node.id}
                className={styles.treeElement}
                nodeId={node.id.toString()}
                label={node.name}
                onClick={() => handleTreeItemClick(node)}
                onLabelClick={() => handleLabelClick(node)}
            >
                {isArray(node.children)
                    ? node.children.map((child) => renderCategoryTree(child))
                    : null}
            </TreeItem>
        </div>
    ), [ handleTreeItemClick, handleLabelClick ]);
    
    const renderCategoryTreeView = (treeItems: ITreeItemType[]) => treeItems.map((c) => renderCategoryTree(c));

    return (
        <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<MdExpandMore/>}
            defaultExpandIcon={<MdChevronRight/>}
            selected={selected}
            expanded={expanded}
        >
            <div className={styles.tooltip}> {renderCategoryTreeView(items)}</div> 
            {renderCategoryTreeView(items)}
        </TreeView>
    );
};

export default CategoryTree;

export type {
    ITreeItemType,
};
