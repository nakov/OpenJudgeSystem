import * as React from 'react';
import styles from './Label.module.scss';
import concatClassNames from '../../../utils/class-names';
import { IHaveOptionalChildrenProps, IHaveOptionalClassName } from '../../common/Props';

type LabelType = 'success' | 'danger' | 'warning' | 'info' | 'plain';

interface ILabelProps extends IHaveOptionalChildrenProps, IHaveOptionalClassName {
    type: LabelType;
    text?: string;
}

const typeToClassName = (type: LabelType) => {
    const map = {
        success: styles.success,
        warning: styles.warning,
        info: styles.info,
        danger: styles.danger,
        plain: styles.plain,
    };
    return map[type];
};

const Label = ({
    type,
    text = '',
    children = null,
    className = '',
}: ILabelProps) => {
    if (!text && !children) {
        throw new Error('Buttons must have only `text` or `children`');
    }
    const content = children ?? text;

    const typeClassName = typeToClassName(type);

    const labelClassName = concatClassNames(
        styles.label,
        typeClassName,
        className,
    );

    return (
        <div className={labelClassName}>
            {content}
        </div>
    );
};

export default Label;
