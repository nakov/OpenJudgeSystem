import * as React from 'react';
import { Breadcrumbs } from '@material-ui/core';
import { useCallback } from 'react';
import { isNil } from 'lodash';
import concatClassNames from '../../../utils/class-names';
import { IHaveOptionalClassName } from '../../common/Props';
import generateId from '../../../utils/id-generator';

import styles from './Breadcrumb.module.scss';

interface IBreadcrumbProps<TValue> extends IHaveOptionalClassName {
    id?: string;
    items?: TValue[] | null,
    itemFunc: (value: TValue) => React.ReactElement;
    keyFunc?: (value: TValue) => string,
}

const defaultKeyFunc = <TValue extends unknown>(value: TValue) => {
    const objWithId = value as { id: string };

    if (objWithId.id) {
        return objWithId.id.toString();
    }

    return JSON.stringify(value);
};

const Breadcrumb = <TValue extends unknown>({
    id = generateId(),
    items = null,
    itemFunc,
    keyFunc = defaultKeyFunc,
    className = '',
}: IBreadcrumbProps<TValue>) => {

    const breadcrumbClassName = concatClassNames(
        styles.breadcrumb,
        className,
    );

    const renderItems = useCallback(
        () => {
            if (isNil(items)) {
                return null;
            }

            return items.map((value) => (
                <div key={keyFunc(value)} >
                    {itemFunc(value)}
                </div>
            ));
        },
        [ itemFunc, keyFunc, items ],
    );

    return <Breadcrumbs id={id} className={breadcrumbClassName}>
        {renderItems()}
    </Breadcrumbs>;
};

export default Breadcrumb;

export type {
    IBreadcrumbProps,
};
