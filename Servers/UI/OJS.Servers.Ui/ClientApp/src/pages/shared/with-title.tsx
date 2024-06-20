import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Params, useParams } from 'react-router';

import { IHaveChildrenPropsWithTitle } from '../../components/common/Props';

interface IWithTitleProps {
    Component: React.FC;
    title: string | ((params: Params<string>) => string);
}

const Page = ({ children, title }: IHaveChildrenPropsWithTitle) => {
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

const withTitle: React.FC<IWithTitleProps> = ({ title, Component }) => (
    <Page title={title}>
        <Component />
    </Page>
);

export default withTitle;
