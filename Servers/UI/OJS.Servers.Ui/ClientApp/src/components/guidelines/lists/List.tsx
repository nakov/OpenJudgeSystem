import * as React from 'react';
import concatClassNames from '../../../utils/class-names';

import styles from './List.module.scss';

interface IListProps<TValue> {
    values: TValue[];
    itemFunc: (value: TValue) => React.ReactElement;
    keyFunc?: (value: TValue) => string,
    className?: string | string[];
    itemClassName?: string | string[];
    type?: 'normal' | 'numbered' | 'alpha' | 'bulleted';
    orientation?: 'vertical' | 'horizontal';
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
}: IListProps<TValue>) => {
    const listTypeClassName =
        type === 'normal'
            ? styles.listNormal
            : type === 'numbered'
                ? styles.listNumbered
                : type === 'alpha'
                    ? styles.listNumberedAlpha
                    : styles.listBulleted;

    const listOrientationClassName =
        orientation === 'vertical'
            ? ''
            : styles.listHorizontal;

    const listClassName = concatClassNames(listTypeClassName, listOrientationClassName, className);
    const itemClassNameCombined = concatClassNames(itemClassName);

    const items = values.map((value) => (
        <li key={keyFunc(value)} className={itemClassNameCombined}>
            {itemFunc(value)}
        </li>
    ));

    if (type === 'numbered') {
        return (
            <ol className={listClassName}>
                {items}
            </ol>
        );
    }

    return (
        <ul className={listClassName}>
            {items}
        </ul>
    );
};

export default List;
