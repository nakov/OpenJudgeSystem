import React from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import useTheme from '../../../hooks/use-theme';

import styles from './ContestBreadcrumbs.module.scss';

const ContestBreadcrumbs = () => {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const { themeColors } = useTheme();
    const { breadcrumbItems } = useSelector((state: any) => state.contests);

    const renderBreadcrumbItems = (breadcrumbItem: any, isLast: boolean, idx: number) => (
        <div
          key={`contest-breadcrumb-item-${idx}`}
          onClick={() => {
              searchParams.set('category', breadcrumbItem.id.toString());
              setSearchParams(searchParams);
          }}
          style={{
              color: isLast
                  ? themeColors.textColor
                  : '#44A9F8',
          }}
        >
            {`${breadcrumbItem.name} ${!isLast
                ? ' / '
                : ''}`}
        </div>
    );

    if (breadcrumbItems.length === 0) {
        return <div />;
    }

    // eslint-disable-next-line consistent-return
    return (
        <div
          className={styles.breadcrumbsWrapper}
          style={{ color: themeColors.textColor, backgroundColor: themeColors.baseColor500 }}
        >
            {breadcrumbItems.map((item: any, idx: number) => renderBreadcrumbItems(item, idx === breadcrumbItems.length - 1, idx))}
        </div>
    );
};

export default ContestBreadcrumbs;
