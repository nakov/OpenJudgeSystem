import { createElement } from 'react';

import concatClassNames from '../../../utils/class-names';
import generateId from '../../../utils/id-generator';
import { IHaveChildrenProps, IHaveOptionalClassName } from '../../common/Props';

import styles from './Heading.module.scss';

enum HeadingType {
    primary = 1,
    secondary = 2,
    small = 3,
}

interface IHeadingProps extends IHaveChildrenProps, IHaveOptionalClassName {
    type?: HeadingType;
    id?: string;
}

const headingTypeToElementTypeMap = {
    [HeadingType.primary]: 'h1',
    [HeadingType.secondary]: 'h2',
    [HeadingType.small]: 'h3',
};

const Heading = ({ children, type = HeadingType.primary, className = '', id = generateId() }: IHeadingProps) => {
    const headingTypeClassName = type === HeadingType.primary
        ? styles.primary
        : type === HeadingType.secondary
            ? styles.secondary
            : styles.small;

    const headingClassName = concatClassNames(
        styles.heading,
        headingTypeClassName,
        className,
    );

    // eslint-disable-next-line prefer-destructuring
    const elementType = headingTypeToElementTypeMap[type];

    return createElement(elementType, {
        id: { id },
        className: headingClassName,
    }, children);
};

export default Heading;

export {
    HeadingType,
};
