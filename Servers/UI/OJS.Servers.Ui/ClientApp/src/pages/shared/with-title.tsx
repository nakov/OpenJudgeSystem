import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Params } from 'react-router';

interface IWithTitleProps {
    Component: React.FC;
    title: string | ((params: Params<string>) => string);
    params: Readonly<Params<string>>;
}

const withTitle: React.FC<IWithTitleProps> = ({ title, Component, params }) => {
    const pageTitle = typeof title === 'function'
        ? title(params)
        : title;

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
            </Helmet>
            <Component />
        </>
    );
};

export default withTitle;
