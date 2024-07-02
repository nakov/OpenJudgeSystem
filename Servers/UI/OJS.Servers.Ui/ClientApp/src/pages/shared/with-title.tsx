import React, { FC, useEffect, useMemo } from 'react';
import { Params, useParams } from 'react-router-dom';

import { Anything } from '../../common/common-types';

interface IHaveChildrenPropsWithTitle {
    children: React.ReactNode;
    title: string | ((params: Params) => string);
}

const Page = ({ children, title } : IHaveChildrenPropsWithTitle) => {
    const params = useParams();

    const pageTitle = useMemo(
        () => typeof title === 'function'
            ? title(params)
            : title,
        [ title, params ],
    );

    useEffect(() => {
        document.title = `${pageTitle} - SoftUni Judge`;
    }, [ pageTitle ]);

    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
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
