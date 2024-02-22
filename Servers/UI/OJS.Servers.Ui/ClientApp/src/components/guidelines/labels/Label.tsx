import concatClassNames from '../../../utils/class-names';
import { IHaveOptionalChildrenProps, IHaveOptionalClassName } from '../../common/Props';

import styles from './Label.module.scss';

enum LabelType {
    success = 1,
    danger = 2,
    warning = 3,
    info = 4,
    plain = 5,
}

interface ILabelProps extends IHaveOptionalChildrenProps, IHaveOptionalClassName {
    type: LabelType;
    text?: string;
}

const typeToClassName = (type: LabelType) => {
    const map = {
        [LabelType.success]: styles.success,
        [LabelType.warning]: styles.warning,
        [LabelType.info]: styles.info,
        [LabelType.danger]: styles.danger,
        [LabelType.plain]: styles.plain,
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

    const labeTypeClassName = 'labelType';
    const labelClassName = concatClassNames(
        styles.label,
        typeClassName,
        labeTypeClassName,
        className,
    );

    return (
        <div className={labelClassName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {content}
        </div>
    );
};

export default Label;

export {
    LabelType,
};
