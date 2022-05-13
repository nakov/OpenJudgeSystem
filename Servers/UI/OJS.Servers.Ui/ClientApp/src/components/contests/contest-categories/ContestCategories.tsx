import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@material-ui/lab';
import { MdChevronRight, MdExpandMore } from 'react-icons/md';
import { useContestCategories } from '../../../hooks/use-contest-categories';
import Heading from '../../guidelines/headings/Heading';

import styles from './ContestCategories.module.scss';
import { IContestCategoryTreeType } from '../../../common/types';
import { isArray, isEmpty } from 'lodash';

const ContestCategories = () => {
    const {
        state: {
            categories,
        },
    } = useContestCategories();

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

        console.log('This is leaf node');
        console.log(node);
        // TODO: fetch contests on leaf node
    };

    return (
        <div className={styles.container}>
            <Heading type="secondary">Categories: </Heading>
            <TreeView
                aria-label="rich object"
                defaultCollapseIcon={<MdExpandMore />}
                defaultExpandIcon={<MdChevronRight />}
            >
                {categories?.map((c) => renderTree(c))}
            </TreeView>
        </div>
    );
}

export default ContestCategories;