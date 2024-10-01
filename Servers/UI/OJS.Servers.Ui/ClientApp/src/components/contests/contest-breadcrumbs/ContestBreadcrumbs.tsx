/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ContestBreadcrumb } from '../../../common/contest-types';
import { getAllContestsPageUrl } from '../../../common/urls/compose-client-urls';
import useTheme from '../../../hooks/use-theme';
import {
    clearContestCategoryBreadcrumbItems,
    setContestCategories,
    updateContestCategoryBreadcrumbItem,
} from '../../../redux/features/contestsSlice';
import { useGetContestCategoriesQuery } from '../../../redux/services/contestsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import trimBreadcrumbItems from '../../../utils/breadcrumb-utils';
import concatClassNames from '../../../utils/class-names';
import { findContestCategoryByIdRecursive, findParentNames } from '../contest-categories/ContestCategories';

import styles from './ContestBreadcrumbs.module.scss';

interface IContestBreadcrumbsProps {
    isHidden?: boolean;
}

const ContestBreadcrumbs = ({ isHidden = false }: IContestBreadcrumbsProps) => {
    const dispatch = useAppDispatch();
    const { categoryId } = useParams();
    const { themeColors, getColorClassName } = useTheme();
    const { breadcrumbItems, contestCategories, contestDetails } = useAppSelector((state) => state.contests);
    const { data, isLoading, refetch } = useGetContestCategoriesQuery();

    const textColorClassName = getColorClassName(themeColors.textColor);
    const backgroundColorClassName = getColorClassName(themeColors.baseColor300);

    // fetch contests data, if it's not present beforehand
    useEffect(() => {
        if (contestCategories?.length === 0) {
            refetch();
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    useEffect(() => {
        dispatch(setContestCategories({ contestCategories: data || [] }));
    }, [ data, dispatch ]);

    // set selected category when loading from specific url and no data is present beforehand
    useEffect(() => {
        // contests page have directly category id in the url
        // if we make request for it, we go into recursion
        const selectedCategoryId = categoryId || contestDetails?.categoryId;

        if (!selectedCategoryId) {
            dispatch(clearContestCategoryBreadcrumbItems());
            return;
        }

        const selectedCategory = findContestCategoryByIdRecursive(contestCategories, Number(selectedCategoryId));
        if (selectedCategory) {
            const selectedCategoryBreadcrumbItems = findParentNames(contestCategories, selectedCategory.id);

            dispatch(updateContestCategoryBreadcrumbItem({ elements: selectedCategoryBreadcrumbItems }));
        }
    }, [ contestCategories, contestDetails, categoryId, dispatch ]);

    const renderBreadcrumbItems = (breadcrumbItem: ContestBreadcrumb, isLast: boolean) => (
        <Link
          key={`contest-breadcrumb-item-${breadcrumbItem.id}`}
          to={getAllContestsPageUrl({ categoryId: breadcrumbItem.id, categoryName: breadcrumbItem.name })}
        >
            <div
              className={`${styles.item} ${isLast
                  ? textColorClassName
                  : ''}`}
            >
                <div>
                    {breadcrumbItem.name}
                    {' '}
                    {!isLast && '/'}
                </div>
            </div>
        </Link>
    );

    const className = concatClassNames(
        styles.breadcrumbsWrapper,
        textColorClassName,
        backgroundColorClassName,
        isHidden
            ? styles.nonVisible
            : '',
    );

    if (isLoading) {
        return <div className={className}>Loading breadcrumbs...</div>;
    }

    return (
        <div className={className}>
            <Link to="/" className={`${styles.item} ${styles.staticItem}`}>Home</Link>
            {' / '}
            <Link
              to={getAllContestsPageUrl({})}
              className={`${styles.item} ${styles.staticItem} ${breadcrumbItems.length === 0
                  ? textColorClassName
                  : ''}`}
            >
                Contests
            </Link>
            {breadcrumbItems?.length > 0 && ' / '}
            {/* eslint-disable-next-line max-len */}
            {trimBreadcrumbItems(breadcrumbItems)?.map((item: ContestBreadcrumb, idx: number) => renderBreadcrumbItems(item, idx === breadcrumbItems.length - 1))}
        </div>
    );
};

export default ContestBreadcrumbs;
