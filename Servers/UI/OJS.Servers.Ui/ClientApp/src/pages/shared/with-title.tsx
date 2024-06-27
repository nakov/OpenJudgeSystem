import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { Params, useParams } from 'react-router-dom';

import { Anything } from '../../common/common-types';

interface IHaveChildrenPropsWithTitle {
    children: React.ReactNode;
    title: string | ((params: Params<string>) => string);
}

const Page = ({ children, title } : IHaveChildrenPropsWithTitle) => {
    const params = useParams();

    const pageTitle = typeof title === 'function'
        ? title(params)
        : title;

    return (
        <>
            <Helmet>
                <title>{`${pageTitle} - SoftUni Judge`}</title>
            </Helmet>
            {children}
        </>
    );
};

const withTitle = (ComponentToWrap: FC, title: string | ((params: Params<string>) => string)) => (props: Anything) => (
    <Page title={title}>
        <ComponentToWrap {...props} />
    </Page>
);

export default withTitle;
