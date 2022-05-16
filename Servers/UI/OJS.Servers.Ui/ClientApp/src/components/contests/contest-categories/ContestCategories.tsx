import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@material-ui/lab';
import { MdChevronRight, MdExpandMore } from 'react-icons/md';
import { useContestCategories } from '../../../hooks/use-contest-categories';
import Heading from '../../guidelines/headings/Heading';

import styles from './ContestCategories.module.scss';
import { IContestCategoryTreeType } from '../../../common/types';
import { FilterType, IFilter } from '../../../common/contest-types';
import { isArray, isEmpty } from 'lodash';
import { useContests } from '../../../hooks/use-contests';

const ContestCategories = () => {
    const {
        state: {
            categories,
        },
    } = useContestCategories();

    const {
        actions: {
            applyFilter,
        }
    } = useContests();

    const renderTree = (node: IContestCategoryTreeType) => (
        <TreeItem
            key={node.id}
            nodeId={node.id.toString()}
            label={node.name}
            onLabelClick={() => handleTreeItemClick(node)}
        >
            {isArray(node.children)
                ? node.children.map((child) => renderTree(child))
                : null}
        </TreeItem>
      );

    const handleTreeItemClick = (node: IContestCategoryTreeType) => {
        if (!isEmpty(node.children)) {
            return;
        }

        const filter = {
            name: node.id.toString(),
            id: node.id,
            type: FilterType.Category } as IFilter;
        
        applyFilter(filter, true);
    };

    return (
        <div className={styles.container}>
            <Heading
                type="small"
                className={styles.heading}
            >
                Category
            </Heading>
            <TreeView
                aria-label="rich object"
                defaultCollapseIcon={<MdExpandMore />}
                defaultExpandIcon={<MdChevronRight />}
            >
                {categories.map((c) => renderTree(c))}
            </TreeView>
        </div>
    );
}

export default ContestCategories;