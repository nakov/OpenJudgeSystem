import * as React from 'react';
import { useEffect, useState } from 'react';
import { IHaveChildrenProps } from '../../common/Props';
import concatClassNames from '../../../utils/class-names';
import styles from './Collapsible.module.scss';

interface ICollapsibleComponentProps extends IHaveChildrenProps {
    collapsed: boolean;
    contentContainerClassName?: string;
}

const Collapsible = ({
    collapsed,
    contentContainerClassName,
    children,
}: ICollapsibleComponentProps) => {
    const [ isCollapsed, setCollapsed ] = useState(collapsed);
    const [
        internalContainerClassName,
        setInternalContainerClassName,
    ] = useState<string>();

    useEffect(() => {
        setInternalContainerClassName(concatClassNames(
            contentContainerClassName,
            styles.collapsibleContainer,
            isCollapsed
                ? styles.visible
                : styles.hidden,
        ));
    }, [ contentContainerClassName, isCollapsed ]);

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
