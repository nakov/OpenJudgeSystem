import * as React from 'react';
import { useCallback } from 'react';
import {
    isEmpty,
    isNil,
} from 'lodash';
import concatClassNames from '../../../utils/class-names';

import {
    ClassNameType,
    IHaveOptionalClassName,
} from '../../common/Props';

import styles from './List.module.scss';

interface IListProps<TValue> extends IHaveOptionalClassName {
    values: TValue[];
    itemFunc: (value: TValue) => React.ReactElement;
    keyFunc?: (value: TValue) => string,
    itemClassName?: ClassNameType;
    type?: 'normal' | 'numbered' | 'alpha' | 'bulleted';
    orientation?: 'vertical' | 'horizontal';
    wrap?: boolean;
    fullWidth?: boolean;
}

const defaultKeyFunc = <TValue extends unknown>(value: TValue) => {
    const objWithId = value as { id: string };

    if (objWithId.id) {
        return objWithId.id.toString();
    }

    return JSON.stringify(value);
};

const List = <TValue extends unknown>({
    values,
    itemFunc,
    keyFunc = defaultKeyFunc,
    className = '',
    itemClassName = '',
    type = 'normal',
    orientation = 'vertical',
    wrap = false,
    fullWidth = false,
}: IListProps<TValue>) => {
    const listTypeClassName =
        type === 'normal'
            ? styles.normal
            : type === 'numbered'
                ? styles.numbered
                : type === 'alpha'
                    ? concatClassNames(styles.numbered, styles.alpha)
                    : styles.bulleted;

    const listOrientationClassName =
        orientation === 'vertical'
            ? ''
            : styles.horizontal;

    const listWrapClassName = wrap
        ? styles.wrap
        : '';

    const listClassName = concatClassNames(styles.list, listTypeClassName, listOrientationClassName, listWrapClassName, className);
    const fullWidthItemClassName = fullWidth
        ? styles.fullWidth
        : '';
    const itemClassNameCombined = concatClassNames(itemClassName, fullWidthItemClassName);

    const renderItems = useCallback(
        () => {
            if (isNil(values) || isEmpty(values)) {
                return null;
            }

            return values.map((value) => (
                <li key={keyFunc(value)} className={itemClassNameCombined}>
                    {itemFunc(value)}
                </li>
            ));
        },
        [ itemClassNameCombined, itemFunc, keyFunc, values ],
    );

    if (type === 'numbered') {
        return (
            <ol className={listClassName}>
                {renderItems()}
            </ol>
        );
    }

    return (
        <ul className={listClassName}>
            {renderItems()}
        </ul>
    );
};

export default List;
