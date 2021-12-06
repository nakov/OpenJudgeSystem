import * as React from 'react';

import IHaveChildrenProps from '../../common/IHaveChildrenProps';

import styles from './Heading.module.scss';
import concatClassNames from '../../../utils/class-names';

interface IHeadingProps extends IHaveChildrenProps {
    type?: 'primary' | 'secondary' | 'small';
    className?: string | string[];
}

const Heading = ({ children, type = 'primary', className = '' }: IHeadingProps) => {
    const headingTypeClassName = type === 'primary'
        ? styles.primary
        : type === 'secondary'
            ? styles.secondary
            : styles.small;

    const headingClassName = concatClassNames(headingTypeClassName, className);

    if (type === 'primary') {
        return (<h1 className={headingClassName}>{children}</h1>);
    }
    if (type === 'secondary') {
        return (<h2 className={headingClassName}>{children}</h2>);
    }
    if (type === 'small') {
        return (<h3 className={headingClassName}>{children}</h3>);
    }

    return null;
};

export default Heading;
