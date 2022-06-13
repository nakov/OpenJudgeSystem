import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { IHaveChildrenProps } from '../../common/Props';
import concatClassNames from '../../../utils/class-names';
import styles from './Collapsible.module.scss';

interface ICollapsibleComponentProps extends IHaveChildrenProps {
    collapsed: boolean;
    containerClassName?: string;
}

const Collapsible = ({
    collapsed,
    containerClassName = '',
    children,
}: ICollapsibleComponentProps) => {
    const [ internalCollapsed, setInternalCollapsed ] = useState(collapsed);

    const internalContainerClassName = useMemo(() => concatClassNames(
        containerClassName,
        styles.collapsibleContainer,
        internalCollapsed
            ? styles.visible
            : styles.hidden,
    ), [ containerClassName, internalCollapsed ]);

    useEffect(() => {
        setInternalCollapsed(collapsed);
    }, [ collapsed ]);

    return (
        <div className={internalContainerClassName}>
            {children}
        </div>
    );
};

export default Collapsible;
