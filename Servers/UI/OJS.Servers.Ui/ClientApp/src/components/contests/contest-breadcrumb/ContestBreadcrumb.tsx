import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { useContestCategories } from '../../../hooks/use-contest-categories';
import { ICategoriesBreadcrumbItem, useCategoriesBreadcrumbs } from '../../../hooks/use-contest-categories-breadcrumb';
import concatClassNames from '../../../utils/class-names';
import { getContestCategoryBreadcrumbItemPath } from '../../../utils/urls';
import Breadcrumb from '../../guidelines/breadcrumb/Breadcrumb';
import { Button, ButtonType } from '../../guidelines/buttons/Button';

import styles from './ContestBreadcrumb.module.scss';

interface IContestBreadcrumb {
    isLastBreadcrumbGrey?: boolean;
}

const ContestBreadcrumb = ({ isLastBreadcrumbGrey = false }: IContestBreadcrumb) => {
    const { state: { breadcrumbItems }, actions: { updateBreadcrumb } } = useCategoriesBreadcrumbs();
    const { state: { categoriesFlat } } = useContestCategories();
    const navigate = useNavigate();

    const updateBreadcrumbAndNavigateToCategory = useCallback(
        (breadcrumb: ICategoriesBreadcrumbItem) => {
            const category = categoriesFlat.find(({ id }) => id.toString() === breadcrumb.id.toString());

            updateBreadcrumb(category, categoriesFlat);
            navigate(getContestCategoryBreadcrumbItemPath(breadcrumb.id));
        },
        [ categoriesFlat, navigate, updateBreadcrumb ],
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
                />
            );
        },
        [ updateBreadcrumbAndNavigateToCategory, isLastBreadcrumbGrey ],
    );

    return <Breadcrumb items={breadcrumbItems} itemFunc={renderCategoriesBreadcrumbItem} />;
};

export default ContestBreadcrumb;
