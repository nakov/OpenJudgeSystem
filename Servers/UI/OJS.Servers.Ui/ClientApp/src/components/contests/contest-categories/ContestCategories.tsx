import React, { useCallback } from 'react';
import { isEmpty, isUndefined } from 'lodash';
import { useContestCategories } from '../../../hooks/use-contest-categories';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';

import styles from './ContestCategories.module.scss';
import { useContests } from '../../../hooks/use-contests';
import { IHaveOptionalClassName } from '../../common/Props';
import Tree, { ITreeItemType } from '../../guidelines/trees/Tree';

interface IContestCategoriesProps extends IHaveOptionalClassName {
}

const ContestCategories = ({ className = '' }: IContestCategoriesProps) => {
    const { state: { categories } } = useContestCategories();

    const {
        state: { possibleFilters },
        actions: { applyFilter },
    } = useContests();

    const handleTreeItemClick = useCallback((node: ITreeItemType) => {
        if (!isEmpty(node.children)) {
            return;
        }

        const filter = possibleFilters.find(({ value }) => value.toString() === node.id.toString());

        if (isUndefined(filter)) {
            return;
        }

        applyFilter(filter, true);
    }, [ applyFilter, possibleFilters ]);

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
