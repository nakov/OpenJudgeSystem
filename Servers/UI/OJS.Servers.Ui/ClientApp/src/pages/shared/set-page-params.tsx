import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router';
import isNil from 'lodash/isNil';

import { IHaveChildrenProps } from '../../components/common/Props';
import { useRouteUrlParams } from '../../hooks/common/use-route-url-params';

const Page = ({ children }: IHaveChildrenProps) => {
    const params = useParams();
    const { actions: { setParams } } = useRouteUrlParams();

    useEffect(
        () => {
            if (isNil(params)) {
                return;
            }

            setParams(params);
        },
        [ params, setParams ],
    );

    return (
        <>
            {children}
            {' '}
        </>

    );
};

const asPage = (ComponentToWrap: FC) => (props: any) => (
    <Page>
        {/* eslint-disable-next-line react/react-in-jsx-scope,react/jsx-props-no-spreading */}
        <ComponentToWrap {...props} />
    </Page>
);

export default Page;

export {
    asPage,
};
