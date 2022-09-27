import React, { useCallback, useEffect, useState } from 'react';
import { TreeItem, TreeView } from '@material-ui/lab';
import { isArray, isEmpty, without } from 'lodash';
import MdExpandMoreIcon from '../../guidelines/icons/MdExpandMoreIcon';
import MdChevronRightIcon from '../../guidelines/icons/MdChervronRightIcon';
import ITreeItemType from '../../../common/tree-types';
import { ITreeProps } from '../../guidelines/trees/Tree';

import styles from './CategoriesTree.module.scss';

interface ICategoriesTreeProps extends ITreeProps{
}

const CategoryTree = ({
    items,
    onCategoryLabelClick,
    defaultSelected,
    defaultExpanded = [],
}: ICategoriesTreeProps) => {
    const [ expandedCategoriesIds, setExpanded ] = useState([] as string[]);
    const [ selectedCategoriesIds, setSelected ] = useState('');

    const handleTreeItemClick = useCallback(
        (node: ITreeItemType) => {
            const id = node.id.toString();
            const newExpanded = expandedCategoriesIds.includes(id)
                ? without(expandedCategoriesIds,id)
                : [ ...expandedCategoriesIds,id ];

            setExpanded(newExpanded);
        },
        [ expandedCategoriesIds, setExpanded ],
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
            if (isEmpty(selectedCategoriesIds) && defaultSelected) {
                setSelected(defaultSelected);
            }
        },
        [ defaultSelected, selectedCategoriesIds ],
    );

    useEffect(
        () => {
            if (isEmpty(expandedCategoriesIds) && !isEmpty(defaultExpanded)) {
                setExpanded(defaultExpanded);
            }
        },
        [ defaultExpanded, expandedCategoriesIds ],
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
            defaultCollapseIcon={<MdExpandMoreIcon />}
            defaultExpandIcon={<MdChevronRightIcon />}
            selected={selectedCategoriesIds}
            expanded={expandedCategoriesIds}
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
