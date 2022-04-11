import * as React from 'react';
import styles from './Label.module.scss';
import concatClassNames from '../../../utils/class-names';
import { IHaveOptionalChildrenProps, IHaveOptionalClassName } from '../../common/Props';

interface ILabelProps extends IHaveOptionalChildrenProps, IHaveOptionalClassName {
    type: 'success' | 'danger' | 'warning' | 'info';
    text?: string;
}

const Label = ({
    type,
    text = '',
    children = null,
}: ILabelProps) => {
    if (!text && !children) {
        throw new Error('Buttons must have only `text` or `children`');
    }
    const content = children ?? text;

    const typeClassName =
        type === 'success'
            ? styles.success
            : type === 'warning'
                ? styles.warning
                : type === 'info'
                    ? styles.info
                    : styles.danger;

    const className = concatClassNames(
        styles.label,
        typeClassName,
    );

    return (
        <div className={className}>
            {content}
        </div>
    );
};

export default Label;
