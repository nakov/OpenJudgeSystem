import React from 'react';
import {TreeItem, TreeView} from '@material-ui/lab';
import {MdChevronRight, MdExpandMore} from 'react-icons/md';
import {useContestCategories} from '../../../hooks/use-contest-categories';
import Heading from '../../guidelines/headings/Heading';

import styles from './ContestCategories.module.scss';
import {IContestCategoryTreeType} from '../../../common/types';
import {FilterType} from '../../../common/contest-types';
import {isArray, isEmpty} from 'lodash';
import {useContests} from '../../../hooks/use-contests';
import {generateFilterItems} from "../../../common/filter-utils";
import {ClassNameType, IHaveOptionalClassName} from "../../common/Props";
import concatClassNames from "../../../utils/class-names";

interface IContestCategoriesProps extends IHaveOptionalClassName {
}

const ContestCategories = ({
    className = ''
}: IContestCategoriesProps) => {
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
        
        const filter = generateFilterItems(
            FilterType.Category,
            { name: node.name, value: node.id.toString() })[0];
        
        applyFilter(filter, true);
    };
    
    const newClassName = concatClassNames(styles.container, className);

    return (
        <div className={newClassName}>
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