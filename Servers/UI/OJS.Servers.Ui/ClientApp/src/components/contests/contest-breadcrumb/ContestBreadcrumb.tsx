import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';
import isNil from 'lodash/isNil';

import { IFilter } from '../../../common/contest-types';
import { useContestCategories } from '../../../hooks/use-contest-categories';
import { ICategoriesBreadcrumbItem, useCategoriesBreadcrumbs } from '../../../hooks/use-contest-categories-breadcrumb';
import { useContests } from '../../../hooks/use-contests';
import concatClassNames from '../../../utils/class-names';
import { getContestCategoryBreadcrumbItemPath } from '../../../utils/urls';
import Breadcrumb from '../../guidelines/breadcrumb/Breadcrumb';
import { Button, ButtonType } from '../../guidelines/buttons/Button';

import styles from './ContestBreadcrumb.module.scss';

interface IContestBreadcrumbProps {
    withContest: boolean;
    contestName?: string;
    categoryId?: string;
}

const ContestBreadcrumb = ({ withContest, contestName, categoryId }: IContestBreadcrumbProps) => {
    const { state: { possibleFilters }, actions: { toggleParam } } = useContests();
    const navigate = useNavigate();
    const { state: { breadcrumbItems }, actions: { updateBreadcrumb } } = useCategoriesBreadcrumbs();
    const { state: { categoriesFlat } } = useContestCategories();

    const updateBreadcrumbAndNavigateToCategory = useCallback(
        (breadcrumb: ICategoriesBreadcrumbItem) => {
            const category = categoriesFlat.find(({ id }) => id.toString() === breadcrumb.id.toString());
            if (isNil(category)) {
                return;
            }

            if (withContest) {
                const filter = possibleFilters.find((x) => x.value.toString() === categoryId) as IFilter;
                if (isNil(filter)) {
                    return;
                }

                toggleParam(filter);
            }

            updateBreadcrumb(category, categoriesFlat);
            navigate(getContestCategoryBreadcrumbItemPath(breadcrumb.id));
        },
        [ categoriesFlat, navigate, updateBreadcrumb, toggleParam, categoryId, possibleFilters, withContest ],
    );

    const renderCategoriesBreadcrumbItem = useCallback(
        (categoryBreadcrumbItem: ICategoriesBreadcrumbItem) => {
            const { value, isLast } = categoryBreadcrumbItem;

            const classNames = withContest
                ? styles.breadcrumbBtn
                : concatClassNames(styles.breadcrumbBtnWithoutContestName, isLast
                    ? styles.breadcrumbBtnLast
                    : '');

            return (
                <Button
                  type={ButtonType.plain}
                  className={classNames}
                  onClick={() => updateBreadcrumbAndNavigateToCategory(categoryBreadcrumbItem)}
                  text={value}
                />
            );
        },
        [ updateBreadcrumbAndNavigateToCategory, withContest ],
    );

    return (
        <div className={styles.breadCrumbContainer}>
            <Breadcrumb items={breadcrumbItems} itemFunc={renderCategoriesBreadcrumbItem} />
            {withContest && (
            <span className={styles.breadcrumbContestName}>
                <span>/</span>
                <span>{contestName}</span>
            </span>
            )}
        </div>
    );
};

export default ContestBreadcrumb;
