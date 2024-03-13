import React, { useCallback } from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import isNil from 'lodash/isNil';

import useTheme from '../../../hooks/use-theme';
import concatClassNames from '../../../utils/class-names';
import generateId from '../../../utils/id-generator';
import { IHaveOptionalClassName } from '../../common/Props';

import styles from './PageBreadcrumbs.module.scss';

interface IBreadcrumbProps extends IHaveOptionalClassName {
    id?: string;
    keyPrefix: string;
    items?: string[] | null;
}

const PageBreadcrumbs = ({
    id = generateId(),
    keyPrefix,
    items = null,
    className = '',
}: IBreadcrumbProps) => {
    const { themeColors, getColorClassName } = useTheme();

    const textColorClassName = getColorClassName(themeColors.textColor);
    const backgroundColorClassName = getColorClassName(themeColors.baseColor300);

    const itemsList = Array.prototype.concat([ 'Home' ], items);

    const breadcrumbClassName = concatClassNames(
        className,
        textColorClassName,
        backgroundColorClassName,
    );

    const renderItems = useCallback(
        () => {
            if (isNil(items)) {
                return null;
            }

            return itemsList
                .map((item: string, idx: number) => {
                    const isLast = idx === itemsList.length - 1;

                    return (
                        <div
                          key={`${keyPrefix}-breadcrumb-item-${idx}`}
                          onClick={() => {
                          }}
                          className={`${styles.item} ${isLast
                              ? textColorClassName
                              : ''}`}
                        >
                            <div>
                                {item}
                                {' '}
                            </div>
                        </div>
                    );
                });
        },
        [ items, itemsList, keyPrefix, textColorClassName ],
    );

    return (
        <div className={`${styles.breadcrumbsWrapper} ${textColorClassName} ${backgroundColorClassName}`}>
            <Breadcrumbs
              id={id}
              className={breadcrumbClassName}
            >
                {renderItems()}
            </Breadcrumbs>
        </div>
    );
};

export default PageBreadcrumbs;

export type {
    IBreadcrumbProps,
};
