/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ContestBreadcrumb } from '../../../common/contest-types';
import useTheme from '../../../hooks/use-theme';

import styles from './ContestBreadcrumbs.module.scss';

const ContestBreadcrumbs = () => {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const { themeColors, getColorClassName } = useTheme();
    const { breadcrumbItems } = useSelector((state: any) => state.contests);

    const textColorClassName = getColorClassName(themeColors.textColor);
    const backgroundColorClassName = getColorClassName(themeColors.baseColor500);

    const renderBreadcrumbItems = (breadcrumbItem: ContestBreadcrumb, isLast: boolean, idx: number) => (
        <div
          key={`contest-breadcrumb-item-${idx}`}
          onClick={() => {
              searchParams.set('category', breadcrumbItem.id.toString());
              setSearchParams(searchParams);
          }}
          className={`${styles.item} ${isLast
              ? textColorClassName
              : ''}`}
        >
            {`${breadcrumbItem.name} ${!isLast
                ? ' / '
                : ''}`}
        </div>
    );

    if (breadcrumbItems.length === 0) {
        return null;
    }

    return (
        <div className={`${styles.breadcrumbsWrapper} ${textColorClassName} ${backgroundColorClassName}`}>
            {breadcrumbItems
                .map((item: ContestBreadcrumb, idx: number) => renderBreadcrumbItems(item, idx === breadcrumbItems.length - 1, idx))}
        </div>
    );
};

export default ContestBreadcrumbs;
