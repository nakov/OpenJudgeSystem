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

enum ListType {
    normal = 1,
    numbered = 2,
    alpha = 3,
    bulleted = 4,
}

enum Orientation {
    vertical = 1,
    horizontal = 2,
}

interface IListProps<TValue> extends IHaveOptionalClassName {
    values: TValue[];
    itemFunc: (value: TValue) => React.ReactElement;
    keyFunc?: (value: TValue) => string,
    itemClassName?: ClassNameType;
    type?: ListType;
    orientation?: Orientation;
    wrap?: boolean;
    fullWidth?: boolean;
    scrollable?: boolean;
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
    type = ListType.normal,
    orientation = Orientation.vertical,
    wrap = false,
    fullWidth = false,
    scrollable = false,
}: IListProps<TValue>) => {
    const listTypeClassName =
        type === ListType.normal
            ? styles.normal
            : type === ListType.numbered
                ? styles.numbered
                : type === ListType.alpha
                    ? concatClassNames(styles.numbered, styles.alpha)
                    : styles.bulleted;

    const listOrientationClassName =
        orientation === Orientation.vertical
            ? ''
            : styles.horizontal;

    const listWrapClassName = wrap
        ? styles.wrap
        : '';

    const listScrollableClassName =
        scrollable
            ? styles.scrollable
            : '';

    const listClassName = concatClassNames(
        styles.list,
        listTypeClassName,
        listOrientationClassName,
        listWrapClassName,
        listScrollableClassName,
        className,
    );
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

    if (type === ListType.numbered) {
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

export {
    ListType,
    Orientation,
};
