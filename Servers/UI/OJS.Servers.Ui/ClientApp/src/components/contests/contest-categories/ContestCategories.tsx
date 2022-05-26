import React, {useCallback} from 'react';
import {useContestCategories} from '../../../hooks/use-contest-categories';
import Heading, {HeadingType} from '../../guidelines/headings/Heading';

import styles from './ContestCategories.module.scss';
import {FilterType} from '../../../common/contest-types';
import {isEmpty} from 'lodash';
import {useContests} from '../../../hooks/use-contests';
import {generateFilterItems} from "../../../common/filter-utils";
import {IHaveOptionalClassName} from "../../common/Props";
import concatClassNames from "../../../utils/class-names";
import Tree, {ITreeItemType} from "../../guidelines/trees/Tree";

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

    const handleTreeItemClick = useCallback((node: ITreeItemType) => {
        if (!isEmpty(node.children)) {
            return;
        }
        
        const [filter] = generateFilterItems(
            FilterType.Category,
            { name: node.name, value: node.id });

        applyFilter(filter, true);
    }, [ applyFilter ]);
    
    const containerClassName = concatClassNames(styles.container, className);

    return (
        <div className={containerClassName}>
            <Heading
                type={HeadingType.small}
                className={styles.heading}
            >
                Category
            </Heading>
            <Tree
                items={categories}
                handleTreeItemClick={handleTreeItemClick}
            />
        </div>
    );
}

export default ContestCategories;