import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isNil } from 'lodash';
import { useContestCategories } from '../../../hooks/use-contest-categories';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';

import styles from './ContestCategories.module.scss';
import { useContests } from '../../../hooks/use-contests';
import { IHaveOptionalClassName } from '../../common/Props';
import Tree, { ITreeItemType } from '../../guidelines/trees/Tree';
import { IFilter } from '../../../common/contest-types';

interface IContestCategoriesProps extends IHaveOptionalClassName {
    onCategoryClick: (filter: IFilter) => void;
    defaultSelected?: string,
}

const ContestCategories = ({
    className = '',
    onCategoryClick,
    defaultSelected = '',
}: IContestCategoriesProps) => {
    const { state: { categories } } = useContestCategories();
    const { state: { possibleFilters } } = useContests();
    const [ expanded, setExpanded ] = useState([ '' ]);
    const [ selected, setSelected ] = useState('');

    const handleTreeItemClick = useCallback((node: ITreeItemType) => {
        const id = node.id.toString();
        setSelected(id);
        if (expanded.includes(id)) {
            const newExpanded = expanded.filter((e) => e !== id);
            setExpanded(newExpanded);
        } else {
            expanded.push(id);
            setExpanded(expanded);
        }

        const filter = possibleFilters.find(({ value }) => value.toString() === id);

        if (isNil(filter)) {
            return;
        }

        onCategoryClick(filter);
    }, [ possibleFilters, onCategoryClick, expanded ]);

    const flattenTree = useCallback(
        (treeItems: ITreeItemType[], result: ITreeItemType[]) => {
            treeItems.forEach(({ children, ...rest }) => {
                result.push(rest);
                if (!isNil(children)) {
                    flattenTree(children, result);
                }
            });
            return result;
        },
        [],
    );

    const getParents = useCallback(
        (result: string[], allItems: ITreeItemType[], searchId?: string) => {
            if (isNil(searchId)) {
                return result;
            }

            const node = allItems.find(({ id }) => id.toString() === searchId);

            if (isNil(node)) {
                return result;
            }

            if (node.id.toString() === searchId) {
                result.push(searchId);
            }

            getParents(result, allItems, node.parentId?.toString());

            return result;
        },
        [],
    );

    const categoriesFlat = useMemo(
        () => flattenTree(categories, []),
        [ categories, flattenTree ],
    );

    const defaultExpanded = useMemo(
        () => getParents([], categoriesFlat, defaultSelected),
        [ defaultSelected, categoriesFlat, getParents ],
    );

    useEffect(
        () => {
            if (defaultSelected) {
                setSelected(defaultSelected);
                setExpanded(defaultExpanded);
            }
        },
        [ defaultSelected, defaultExpanded ],
    );

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
              expanded={expanded}
              selected={[ selected ]}
            />
        </div>
    );
};

export default ContestCategories;
