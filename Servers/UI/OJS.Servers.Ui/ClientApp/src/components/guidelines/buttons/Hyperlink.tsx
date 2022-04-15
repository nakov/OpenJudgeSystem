import * as React from 'react';
import { Link } from 'react-router-dom';
import concatClassNames from '../../../utils/class-names';
import generateId from '../../../utils/id-generator';

import styles from './Hyperlink.module.scss';

interface IHyperlinkProps {
    to: string;
    text: string;
    id?: string;
    className?: string | string[];
    isToExternal?: boolean;
}

const Hyperlink = ({
    to,
    text,
    className = '',
    id = generateId(),
    isToExternal = false,
 }: IHyperlinkProps ) => {
    const linkClassName = concatClassNames(className, styles.link);

    const toHref= isToExternal
    ? { pathname: to }
    : to;

    const target = isToExternal
        ? "_blank"
        : undefined;

    return (
        <Link
          to={toHref}
          className={linkClassName}
          id={id}
          target={target}
        >
            {text}
        </Link>
    );
}

export default Hyperlink;