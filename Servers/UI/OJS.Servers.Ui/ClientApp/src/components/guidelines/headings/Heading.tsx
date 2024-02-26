import { createElement } from 'react';

import { ThemeMode } from '../../../common/enums';
import useTheme from '../../../hooks/use-theme';
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
    style?: object;
}

const headingTypeToElementTypeMap = {
    [HeadingType.primary]: 'h1',
    [HeadingType.secondary]: 'h2',
    [HeadingType.small]: 'h3',
};

const Heading = ({
    children,
    type = HeadingType.primary,
    className = '', style,
    id = generateId(),
}: IHeadingProps) => {
    const { isDarkMode } = useTheme();

    const colorClassName = isDarkMode
        ? styles.textWhite
        : styles.textDarkGray;

    const headingTypeClassName = type === HeadingType.primary
        ? styles.primary
        : type === HeadingType.secondary
            ? styles.secondary
            : styles.small;

    const headingClassName = concatClassNames(
        styles.heading,
        headingTypeClassName,
        colorClassName,
        className,
    );

    const { [type]: elementType } = headingTypeToElementTypeMap;

    return createElement(elementType, {
        id: { id },
        className: headingClassName,
        style,
    }, children);
};

export default Heading;

export {
    HeadingType,
};
