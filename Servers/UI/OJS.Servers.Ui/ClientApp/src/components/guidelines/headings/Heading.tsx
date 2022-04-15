import * as React from 'react';

import { IHaveChildrenProps, IHaveOptionalClassName } from '../../common/Props';
import concatClassNames from '../../../utils/class-names';
import styles from './Heading.module.scss';
import generateId from '../../../utils/id-generator';

interface IHeadingProps extends IHaveChildrenProps, IHaveOptionalClassName {
    type?: 'primary' | 'secondary' | 'small';
    id?: string;
}

const Heading = ({ children, type = 'primary', className = '', id = generateId() }: IHeadingProps) => {
    const headingTypeClassName = type === 'primary'
        ? styles.primary
        : type === 'secondary'
            ? styles.secondary
            : styles.small;

    const headingClassName = concatClassNames(headingTypeClassName, className);

    if (type === 'primary') {
        return (<h1 id={id} className={headingClassName}>{children}</h1>);
    }
    if (type === 'secondary') {
        return (<h2 id={id} className={headingClassName}>{children}</h2>);
    }
    if (type === 'small') {
        return (<h3 id={id} className={headingClassName}>{children}</h3>);
    }

    return null;
};

export default Heading;
