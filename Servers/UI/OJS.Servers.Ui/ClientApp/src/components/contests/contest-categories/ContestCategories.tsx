/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
import { useEffect, useMemo } from 'react';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

import { IContestCategory } from '../../../common/types';
import { getAllContestsPageUrl } from '../../../common/urls/compose-client-urls';
import useTheme from '../../../hooks/use-theme';
import {
    setContestCategories,
    setContestCategory,
    setContestStrategy,
    updateContestCategoryBreadcrumbItem,
} from '../../../redux/features/contestsSlice';
import { useGetContestCategoriesQuery } from '../../../redux/services/contestsService';
import { useAppDispatch } from '../../../redux/store';
import concatClassNames from '../../../utils/class-names';
import { LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';

import styles from './ContestCategories.module.scss';

interface IContestCategoriesProps {
    isRenderedOnHomePage?: boolean;
}

const ContestCategories = (props: IContestCategoriesProps) => {
    const { isRenderedOnHomePage = false } = props;

    const dispatch = useAppDispatch();
    const [ searchParams ] = useSearchParams();
    const { themeColors, getColorClassName, isDarkMode } = useTheme();

    const textColorClassName = getColorClassName(themeColors.textColor);

    const {
        data: contestCategories,
        isLoading: areCategoriesLoading,
        error: categoriesError,
    } = useGetContestCategoriesQuery();

    const selectedId = useMemo(() => Number(searchParams.get('category')), [ searchParams ]);

    useEffect(() => {
        dispatch(setContestCategories({ contestCategories: contestCategories || [] }));
    }, [ contestCategories, dispatch ]);

    useEffect(() => {
        const selectedCategory = findContestCategoryByIdRecursive(contestCategories, selectedId);
        const breadcrumbItems = findParentNames(contestCategories, selectedId);

        dispatch(setContestCategory(selectedCategory));
        dispatch(updateContestCategoryBreadcrumbItem({ elements: breadcrumbItems }));
    }, [ selectedId, contestCategories, dispatch ]);

    const onContestCategoryClick = (id: number) => {
        const selectedContestCategory = findContestCategoryByIdRecursive(contestCategories, id);
        if (!selectedContestCategory) {
            return;
        }

        dispatch(setContestStrategy(null));
    };

    const renderCategory = (category: IContestCategory, isChildElement = false) => {
        const isActiveOrHasActiveChild = findActiveChildrenByIdRecursive(category.children, selectedId) || selectedId === category.id;
        const categoryItemClassNames = concatClassNames(
            styles.categoryItem,
            selectedId === category.id
                ? styles.selectedCategory
                : '',
            isChildElement
                ? styles.childCategoryItem
                : '',
            isDarkMode
                ? styles.darkCategoryItem
                : '',
        );

        return (
            <div
              key={`contest-category-item-${category.id}`}
              onClick={(ev) => {
                  ev.stopPropagation();
                  onContestCategoryClick(category.id);
              }}
            >
                <LinkButton
                  to={getAllContestsPageUrl({ categoryName: category.name, categoryId: category.id })}
                  type={LinkButtonType.plain}
                  preventScrollReset
                  className={categoryItemClassNames}
                >
                    { isChildElement && category.children.length > 0 && <FaAngleRight /> }
                    {category.name}
                    { !isChildElement && category.children.length > 0 && <FaAngleDown />}
                </LinkButton>
                <div
                  className={`${styles.categoryChildren} ${isActiveOrHasActiveChild
                      ? styles.activeChildren
                      : ''}`}
                >
                    {category.children.map((child) => renderCategory(child, true))}
                </div>
            </div>
        );
    };

    if (areCategoriesLoading) {
        return (
            <div className={styles.contestCategoriesWrapper}>
                <SpinningLoader />
            </div>
        );
    }
    return (
        <div className={styles.contestCategoriesWrapper}>
            <div
              className={`${styles.contestCategoriesHeader} ${textColorClassName}`}
              style={{
                  marginTop: isRenderedOnHomePage
                      ? 0
                      : 32,
              }}
            >
                <div>Contest Categories</div>
            </div>
            { categoriesError
                ? <div className={textColorClassName}>Error loading categories</div>
                : (
                    <div
                      className={`${styles.contestCategoriesInnerWrapper} ${textColorClassName}`}
                    >
                        {contestCategories?.map((contestCategory: IContestCategory) => renderCategory(contestCategory))}
                    </div>
                )}
        </div>
    );
};

// eslint-disable-next-line @typescript-eslint/no-shadow
const findParentNames = (collection: Array<IContestCategory> | undefined, selectedId: number) => {
    if (!collection || !selectedId) {
        return;
    }
    const findParentsRecursive = (
        element: IContestCategory,
        targetId: number,
        parents: Array<{ name: string; id: number }> = [],
    ): Array<{name: string; id: number}> | null => {
        if (element.id === targetId) {
            return [ ...parents, { name: element.name, id: element.id } ];
        }

        for (const child of element.children || []) {
            const result = findParentsRecursive(child, targetId, [ ...parents, { name: element.name, id: element.id } ]);

            if (result) {
                return result;
            }
        }

        return null;
    };

    for (const node of collection) {
        const parents = findParentsRecursive(node, selectedId);
        if (parents) {
            return parents;
        }
    }

    return [];
};

const findContestCategoryByIdRecursive =
    (elements: Array<IContestCategory> | undefined, id: number, rootIndex = 0): IContestCategory | null => {
        if (!elements) {
            return null;
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const contestCategory of elements) {
            if (contestCategory.id === id) {
                return contestCategory;
            }
            if (contestCategory.children.length) {
                const foundCategory = findContestCategoryByIdRecursive(contestCategory.children, id, rootIndex + 1);
                if (foundCategory !== null) {
                    return foundCategory;
                }
            }
        }
        return null;
    };

const findActiveChildrenByIdRecursive = (elements: Array<IContestCategory> | undefined, id: number) => {
    if (!elements) {
        return null;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const element of elements) {
        if (element.id === id) {
            return true;
        }
        if (element.children) {
            const found = findActiveChildrenByIdRecursive(element.children, id);
            if (found) {
                return true;
            }
        }
    }
    return false;
};

export { ContestCategories, findContestCategoryByIdRecursive, findParentNames };
