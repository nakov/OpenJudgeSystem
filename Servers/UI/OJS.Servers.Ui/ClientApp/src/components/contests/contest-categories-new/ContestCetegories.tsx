/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaAngleDown, FaAngleUp, FaRegFileAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { IContestCategory } from '../../../common/types';
import useTheme from '../../../hooks/use-theme';
import { setContestCategory, setContestStrategy } from '../../../redux/features/contestsSlice';
import { useGetContestCategoriesQuery } from '../../../redux/services/contestsService';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';

import styles from './ContestCategories.module.scss';

interface IContestCategoriesProps {
    isRenderedOnHomePage?: boolean;
}

const ContestCetegories = (props: IContestCategoriesProps) => {
    const { isRenderedOnHomePage = false } = props;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const { themeColors } = useTheme();
    const { category: selectedCategory } = useSelector((state: any) => state.filterContests);
    const {
        data: contestCategories,
        isLoading: areCategoriesLoading,
        error: categoriesError,
    } = useGetContestCategoriesQuery();

    const [ isExpanded, setIsExpanded ] = useState<boolean>(true);

    useEffect(() => {
        const categoryId = searchParams.get('category');
        if (categoryId) {
            const selectedContestCategory = findContestCategoryByIdRecursive(contestCategories, Number(categoryId));
            dispatch(setContestCategory(selectedContestCategory));
            const elementToRenderChildren = document.getElementById(`category-${categoryId}-children`);
            if (!elementToRenderChildren) {
                return;
            }

            const children = selectedContestCategory?.children;
            ReactDOM.render((children || []).map((child) => renderCategory(child)), elementToRenderChildren);
        }
    }, []);

    const findContestCategoryByIdRecursive = (elements: Array<IContestCategory> | undefined, id: number): IContestCategory | null => {
        if (!elements) {
            return null;
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const contestCategory of elements) {
            if (contestCategory.id === id) {
                return contestCategory;
            }
            if (contestCategory.children.length) {
                const foundContestCategory = findContestCategoryByIdRecursive(contestCategory.children, id);
                if (foundContestCategory) {
                    return foundContestCategory;
                }
            }
        }
        return null;
    };

    const onContestCategoryClick = (id: number) => {
        if (isRenderedOnHomePage) {
            navigate(`/contests?category=${id}`);
            return;
        }
        const selectedContestCategory = findContestCategoryByIdRecursive(contestCategories, id);
        searchParams.set('category', id.toString());
        setSearchParams(searchParams);
        dispatch(setContestCategory(selectedContestCategory));
        dispatch(setContestStrategy(null));

        const children = selectedContestCategory?.children;
        const elementToRenderChildren = document.getElementById(`category-${id}-children`);
        if (elementToRenderChildren?.children?.length) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ReactDOM.render(null, elementToRenderChildren);
        } else {
            if (!elementToRenderChildren) {
                return;
            }
            ReactDOM.render((children || []).map((child) => renderCategory(child)), elementToRenderChildren);
        }
    };

    const renderCategory = (category: IContestCategory) => (
        <div
          key={`contest-category-item-${category.id}`}
        >
            <div
              style={{ borderBottom: `1px solid ${themeColors.textColor}` }}
              className={`${styles.categoryItem} ${selectedCategory?.id === category.id
                  ? styles.selectedCategory
                  : ''}`}
              onClick={() => onContestCategoryClick(category.id)}
            >
                <FaRegFileAlt />
                <div>
                    {category.name}
                </div>
            </div>
            <div className={styles.categoryChildren} id={`category-${category.id}-children`} />
        </div>
    );

    if (areCategoriesLoading) {
        return <SpinningLoader />;
    }
    return (
        <div className={styles.contestCategoriesWrapper}>
            <div
              className={styles.contestCategoriesHeader}
              style={{ color: themeColors.textColor }}
              onClick={() => setIsExpanded(!isExpanded)}
            >
                Contest Categories
                {isExpanded
                    ? <FaAngleDown />
                    : <FaAngleUp />}
            </div>
            { categoriesError
                ? <div style={{ color: themeColors.textColor }}>Error loading categories</div>
                : (
                    <div
                      className={`${styles.contestCategoriesInnerWrapper} ${isExpanded
                          ? styles.show
                          : ''}`}
                      style={{ color: themeColors.textColor }}
                    >
                        {contestCategories?.map((contestCategory: IContestCategory) => renderCategory(contestCategory))}
                    </div>
                )}
        </div>
    );
};

export default ContestCetegories;
