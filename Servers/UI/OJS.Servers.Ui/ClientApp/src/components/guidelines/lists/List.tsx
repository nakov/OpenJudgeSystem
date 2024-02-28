import React, { useCallback } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import concatClassNames from '../../../utils/class-names';
import defaultKeyFunc from '../../common/colcollection-key-utils';
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
    keyFunc?: (value: TValue) => string;
    itemClassName?: ClassNameType;
    type?: ListType;
    orientation?: Orientation;
    wrap?: boolean;
    scrollable?: boolean;
}

const List = <TValue, >({
    values,
    itemFunc,
    keyFunc = defaultKeyFunc,
    className = '',
    itemClassName = '',
    type = ListType.normal,
    orientation = Orientation.vertical,
    wrap = false,
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

    const itemClassNameCombined = concatClassNames(itemClassName, styles.fullWidth);

    const renderItems = useCallback(
        () => {
            if (isNil(values) || isEmpty(values)) {
                return null;
            }

            return values.map((value, index) => {
                const isLast = index === values.length - 1;
                return (
                    <li
                      key={keyFunc(value)}
                      className={itemClassNameCombined}
                      style={{
                          marginBottom: isLast
                              ? 0
                              : 20,
                      }}
                    >
                        {itemFunc(value)}
                    </li>
                );
            });
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
