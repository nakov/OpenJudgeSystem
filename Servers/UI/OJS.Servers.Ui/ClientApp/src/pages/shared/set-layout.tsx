import * as React from 'react';
import { FC } from 'react';
import IHaveChildrenProps from '../../components/common/IHaveChildrenProps';

import styles from './set-layout.module.scss';

interface ILayoutProps extends IHaveChildrenProps {
}

const Layout = ({ children }: ILayoutProps) => (
    <>
        {children}
    </>
);

const setLayout = (ComponentToWrap: FC) => (props: any) => (
    <Layout>
        <div className={styles.contentWrapper}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <ComponentToWrap {...props} />
        </div>
    </Layout>
);

export default Layout;

export {
    setLayout,
};
