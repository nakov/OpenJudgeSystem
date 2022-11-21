import React, { FC } from 'react';

import { Anything } from '../../common/common-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { usePageTitles } from '../../hooks/use-page-titles';

const Layout = ({ children }: IHaveChildrenProps) => (
    <div>
        {children}
    </div>
);

const withTitle = (ComponentToWrap: FC, title: string) => (props: Anything) => {
    const { actions: { setPageTitle } } = usePageTitles();
    setPageTitle(title);

    return (
        <Layout>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <ComponentToWrap {...props} />
        </Layout>
    );
};
export default Layout;

export {
    withTitle,
};
