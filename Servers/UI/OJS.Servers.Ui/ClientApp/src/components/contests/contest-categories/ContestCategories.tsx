import React, { useCallback } from 'react';
import { isEmpty } from 'lodash';
import { useContestCategories } from '../../../hooks/use-contest-categories';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';

import styles from './ContestCategories.module.scss';
import { FilterType } from '../../../common/contest-types';
import { useContests } from '../../../hooks/use-contests';
import { generateFilterItems } from '../../../common/filter-utils';
import { IHaveOptionalClassName } from '../../common/Props';
import Tree, { ITreeItemType } from '../../guidelines/trees/Tree';

interface IContestCategoriesProps extends IHaveOptionalClassName {
}

const ContestCategories = ({ className = '' }: IContestCategoriesProps) => {
    const { state: { categories } } = useContestCategories();

    const { actions: { applyFilter } } = useContests();

    const onTreeItemClick = useCallback((node: ITreeItemType) => {
        if (!isEmpty(node.children)) {
            return;
        }

        const [ filter ] = generateFilterItems(
            FilterType.Category,
            { name: node.name, value: node.id },
        );

        applyFilter(filter, true);
    }, [ applyFilter ]);

    return (
        <div className={className as string}>
            <Heading
              type={HeadingType.small}
              className={styles.heading}
            >
                Category
            </Heading>
            <Tree
              items={categories}
              onTreeItemClick={onTreeItemClick}
            />
        </div>
    );
};

export default ContestCategories;
