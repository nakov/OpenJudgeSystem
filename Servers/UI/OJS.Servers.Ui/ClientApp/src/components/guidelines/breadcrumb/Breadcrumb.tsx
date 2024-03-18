import React, { useCallback } from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import isNil from 'lodash/isNil';

import useTheme from '../../../hooks/use-theme';
import concatClassNames from '../../../utils/class-names';
import generateId from '../../../utils/id-generator';
import defaultKeyFunc from '../../common/colcollection-key-utils';
import { IHaveOptionalClassName } from '../../common/Props';

import styles from './Breadcrumb.module.scss';

interface IBreadcrumbProps<TValue> extends IHaveOptionalClassName {
    id?: string;
    items?: TValue[] | null;
    itemFunc: (value: TValue) => React.ReactElement;
    keyFunc?: (value: TValue) => string;
}

const Breadcrumb = <TValue, >({
    id = generateId(),
    items = null,
    itemFunc,
    keyFunc = defaultKeyFunc,
    className = '',
}: IBreadcrumbProps<TValue>) => {
    const { themeColors, getColorClassName } = useTheme();

    const textColorClassName = getColorClassName(themeColors.textColor);
    const backgroundColorClassName = getColorClassName(themeColors.baseColor300);

    const breadcrumbClassName = concatClassNames(
        styles.breadcrumb,
        className,
        textColorClassName,
        backgroundColorClassName,
    );

    const renderItems = useCallback(
        () => {
            if (isNil(items)) {
                return null;
            }

            return items.map((value) => (
                <div key={keyFunc(value)}>
                    {itemFunc(value)}
                </div>
            ));
        },
        [ itemFunc, keyFunc, items ],
    );

    return (
        <Breadcrumbs
          id={id}
          className={breadcrumbClassName}
        >
            {renderItems()}
        </Breadcrumbs>
    );
};

export default Breadcrumb;

export type {
    IBreadcrumbProps,
};
