import React, { FC, useEffect } from 'react';

import { Anything } from '../../common/common-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { usePageTitles } from '../../hooks/use-page-titles';

const PageWithTitle = ({ children }: IHaveChildrenProps) => children;

const withTitle = (ComponentToWrap: FC, title: string | undefined) => (props: Anything) => {
    const { actions: { setPageTitle } } = usePageTitles();

    useEffect(() => {
        setPageTitle(title);
    }, [ setPageTitle ]);

    return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
        <PageWithTitle>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <ComponentToWrap {...props} />
        </PageWithTitle>
    );
};
export default PageWithTitle;

export {
    withTitle,
};
