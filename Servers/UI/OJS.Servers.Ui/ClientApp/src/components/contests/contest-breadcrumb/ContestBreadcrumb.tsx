/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import ITreeItemType from '../../../common/tree-types';
import { ICategoriesBreadcrumbItem, useCategoriesBreadcrumbs } from '../../../hooks/use-contest-categories-breadcrumb';
import useTheme from '../../../hooks/use-theme';
import { setContestCategory } from '../../../redux/features/contestsSlice';
import { useGetContestCategoriesQuery } from '../../../redux/services/contestsService';
import concatClassNames from '../../../utils/class-names';
import { flattenWith } from '../../../utils/list-utils';
import { getContestCategoryBreadcrumbItemPath } from '../../../utils/urls';
import Breadcrumb from '../../guidelines/breadcrumb/Breadcrumb';
import { Button, ButtonType } from '../../guidelines/buttons/Button';

import styles from './ContestBreadcrumb.module.scss';

interface IContestBreadcrumb {
    isLastBreadcrumbGrey?: boolean;
}

const ContestBreadcrumb = ({ isLastBreadcrumbGrey = false }: IContestBreadcrumb) => {
    const dispatch = useDispatch();
    const { themeColors } = useTheme();
    const { state: { breadcrumbItems }, actions: { updateBreadcrumb } } = useCategoriesBreadcrumbs();
    const navigate = useNavigate();

    const {
        data: contestCategories,
        isLoading: areCategoriesLoading,
        error: categoriesError,
    } = useGetContestCategoriesQuery();

    const flattenCategories = useMemo(() => {
        if (contestCategories) {
            return flattenWith(contestCategories, (c: ITreeItemType) => c.children || null);
        }
        return [];
    }, [ contestCategories ]);

    const updateBreadcrumbAndNavigateToCategory = useCallback(
        (breadcrumb: ICategoriesBreadcrumbItem) => {
            const category = flattenCategories.find(({ id }) => id.toString() === breadcrumb.id.toString());

            updateBreadcrumb(category, flattenCategories);
            navigate(getContestCategoryBreadcrumbItemPath(breadcrumb.id));
            dispatch(setContestCategory(breadcrumb));
        },
        [ flattenCategories ],
    );

    const renderCategoriesBreadcrumbItem = useCallback(
        (categoryBreadcrumbItem: ICategoriesBreadcrumbItem) => {
            const { value, isLast } = categoryBreadcrumbItem;
            let { breadcrumbBtn: classNames } = styles;
            if (isLastBreadcrumbGrey) {
                classNames = concatClassNames(styles.breadcrumbBtn, isLast
                    ? styles.breadcrumbBtnLast
                    : '');
            }

            return (
                <Button
                  type={ButtonType.plain}
                  className={classNames}
                  onClick={() => updateBreadcrumbAndNavigateToCategory(categoryBreadcrumbItem)}
                  text={value}
                  style={{
                      color: isLast
                          ? themeColors.textColor
                          : '#44a9f8',
                  }}
                />
            );
        },
        [ updateBreadcrumbAndNavigateToCategory, isLastBreadcrumbGrey ],
    );

    if (areCategoriesLoading) {
        return (<div style={{ color: themeColors.textColor }}>Loading breadcrumbs...</div>);
    }

    if (categoriesError) {
        return (<div style={{ color: themeColors.textColor }}>Error loading breadcrumbs. Please try again!</div>);
    }

    return <Breadcrumb items={breadcrumbItems} itemFunc={renderCategoriesBreadcrumbItem} />;
};

export default ContestBreadcrumb;
