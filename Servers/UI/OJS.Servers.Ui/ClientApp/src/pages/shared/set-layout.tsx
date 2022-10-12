import React, { FC } from 'react';

import { IHaveChildrenProps } from '../../components/common/Props';
import concatClassNames from '../../utils/class-names';

import styles from './set-layout.module.scss';

interface ILayoutProps extends IHaveChildrenProps {
    isWide: boolean;
}

const Layout = ({ children, isWide }: ILayoutProps) => {
    const wideClassName = isWide
        ? styles.wideContentWrapper
        : '';

    const className = concatClassNames(styles.contentWrapper, wideClassName);

    return (
        <div className={className}>
            {children}
        </div>
    );
};

const setLayout = (ComponentToWrap: FC, isWide = false) => (props: any) => (
    <Layout isWide={isWide}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <ComponentToWrap {...props} />
    </Layout>
);

export default Layout;

export {
    setLayout,
};
