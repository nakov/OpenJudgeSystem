/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { ContestBreadcrumb } from '../../../common/contest-types';
import { getAllContestsUrl } from '../../../common/urls/compose-client-urls';
import useTheme from '../../../hooks/use-theme';
import {
    setContestCategories,
    updateContestCategoryBreadcrumbItem,
} from '../../../redux/features/contestsSlice';
import { useGetContestCategoriesQuery } from '../../../redux/services/contestsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { findContestCategoryByIdRecursive, findParentNames } from '../contest-categories/ContestCategories';

import styles from './ContestBreadcrumbs.module.scss';

const ContestBreadcrumbs = () => {
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const { themeColors, getColorClassName } = useTheme();
    const { breadcrumbItems, contestCategories, contestDetails } = useAppSelector((state) => state.contests);
    const { data, isLoading, refetch } = useGetContestCategoriesQuery();

    const textColorClassName = getColorClassName(themeColors.textColor);
    const backgroundColorClassName = getColorClassName(themeColors.baseColor500);

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
        const selectedCategoryId = pathname.split('/').filter((el) => el).length === 2
            ? searchParams.get('category')
            : contestDetails?.categoryId;

        if (!selectedCategoryId) {
            return;
        }
        const selectedCategory = findContestCategoryByIdRecursive(contestCategories, Number(selectedCategoryId));
        if (selectedCategory) {
            const selectedCategoryBreadcrumbItems = findParentNames(contestCategories, selectedCategory.id);

            dispatch(updateContestCategoryBreadcrumbItem({ elements: selectedCategoryBreadcrumbItems }));
        }
    }, [ contestCategories, breadcrumbItems.length, contestDetails, pathname, searchParams, dispatch ]);

    const renderBreadcrumbItems = (breadcrumbItem: ContestBreadcrumb, isLast: boolean) => (
        <Link
          key={`contest-breadcrumb-item-${breadcrumbItem.id}`}
          to={getAllContestsUrl(breadcrumbItem.id, undefined, breadcrumbItem.name)}
        >
            <div
              onClick={() => {
                  searchParams.set('category', breadcrumbItem.id.toString());
                  setSearchParams(searchParams);
              }}
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

    if (isLoading) {
        return <div className={getColorClassName(themeColors.textColor)}>Loading breadcrumbs...</div>;
    }

    return (
        <div className={`${styles.breadcrumbsWrapper} ${textColorClassName} ${backgroundColorClassName}`}>
            <Link to="/" className={`${styles.item} ${styles.staticItem}`}>Home</Link>
            {' / '}
            <Link
              to="/contests/all-contests"
              className={`${styles.item} ${styles.staticItem} ${breadcrumbItems.length === 0
                  ? textColorClassName
                  : ''}`}
            >
                Contests
            </Link>
            {breadcrumbItems?.length > 0 && ' / '}
            {/* eslint-disable-next-line max-len */}
            {breadcrumbItems?.map((item: ContestBreadcrumb, idx: number) => renderBreadcrumbItems(item, idx === breadcrumbItems.length - 1))}
        </div>
    );
};

export default ContestBreadcrumbs;
