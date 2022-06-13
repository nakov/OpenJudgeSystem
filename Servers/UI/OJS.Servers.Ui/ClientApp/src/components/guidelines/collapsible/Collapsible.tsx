import * as React from 'react';
import { useEffect, useState } from 'react';
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
    const [ isCollapsed, setCollapsed ] = useState(collapsed);
    const [
        internalContainerClassName,
        setInternalContainerClassName,
    ] = useState<string>();

    useEffect(() => {
        setInternalContainerClassName(concatClassNames(
            containerClassName,
            styles.collapsibleContainer,
            isCollapsed
                ? styles.visible
                : styles.hidden,
        ));
    }, [ containerClassName, isCollapsed ]);

    useEffect(() => {
        setCollapsed(collapsed);
    }, [ collapsed ]);

    return (
        <div className={internalContainerClassName}>
            {children}
        </div>
    );
};

export default Collapsible;
