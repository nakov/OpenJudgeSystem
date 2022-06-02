import React, { useCallback } from 'react';
import { isEmpty, isNil } from 'lodash';
import { useContestCategories } from '../../../hooks/use-contest-categories';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';

import styles from './ContestCategories.module.scss';
import { useContests } from '../../../hooks/use-contests';
import { IHaveOptionalClassName } from '../../common/Props';
import Tree, { ITreeItemType } from '../../guidelines/trees/Tree';
import { IFilter } from '../../../common/contest-types';

interface IContestCategoriesProps extends IHaveOptionalClassName {
    onLeafCategoryClick: (filter: IFilter) => void;
}

const ContestCategories = ({
    className = '',
    onLeafCategoryClick,
}: IContestCategoriesProps) => {
    const { state: { categories } } = useContestCategories();
    const { state: { possibleFilters } } = useContests();

    const handleTreeItemClick = useCallback((node: ITreeItemType) => {
        if (!isEmpty(node.children)) {
            return;
        }

        const filter = possibleFilters.find(({ value }) => value.toString() === node.id.toString());

        if (isNil(filter)) {
            return;
        }

        onLeafCategoryClick(filter);
    }, [ possibleFilters, onLeafCategoryClick ]);

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
              onTreeItemClick={handleTreeItemClick}
            />
        </div>
    );
};

export default ContestCategories;
