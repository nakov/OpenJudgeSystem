import React, { FC } from 'react';

import { Anything } from '../../common/common-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { usePageTitles } from '../../hooks/use-page-titles';

type IPageTitleProvider = IHaveChildrenProps;

const PageTitle = ({ children }: IPageTitleProvider) => (
    <div>
        {children}
    </div>
);

const withTitle = (ComponentToWrap: FC, title: string) => (props: Anything) => {
    const { actions: { setPageTitle } } = usePageTitles();
    setPageTitle(title);

    return (
        <PageTitle>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <ComponentToWrap {...props} />
        </PageTitle>
    );
};
export default PageTitle;

export {
    withTitle,
};
