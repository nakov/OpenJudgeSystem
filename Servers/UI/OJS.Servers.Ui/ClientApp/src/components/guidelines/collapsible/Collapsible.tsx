import * as React from 'react';
import { ReactNode, useCallback, useEffect } from 'react';
import useCollapse from 'react-collapsed';
import styles from './Collapsible.module.scss';

interface ICollapsibleProps {
    header: ReactNode;
    children?: ReactNode;
    collapsed: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Collapsible = ({ header, children, collapsed }: ICollapsibleProps) => {
    const { getCollapseProps, getToggleProps, isExpanded, setExpanded } = useCollapse();

    const render = useCallback(() => (
        <div className="collapsible">
            <div className={styles.collapsibleHeader}>
                { header }
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <div className={styles.collapsibleButton} {...getToggleProps()}>
                    { isExpanded
                        ? 'Hide'
                        : 'Details'}
                </div>
            </div>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <div {...getCollapseProps()}>
                <div className="content">
                    { children }
                </div>
            </div>
        </div>
    ), [ children, getCollapseProps, getToggleProps, header, isExpanded ]);

    useEffect(() => {
        setExpanded(!collapsed);
    }, [ collapsed, setExpanded ]);

    return render();
};

export default Collapsible;
