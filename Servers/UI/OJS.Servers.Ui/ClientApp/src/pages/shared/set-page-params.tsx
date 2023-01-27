import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router';
import first from 'lodash/first';
import isNil from 'lodash/isNil';

import { IHaveChildrenProps } from '../../components/common/Props';
import { useRouteUrlParams } from '../../hooks/common/use-route-url-params';
import { toList } from '../../utils/object-utils';

const Page = ({ children }: IHaveChildrenProps) => {
    const params = useParams();
    const { actions: { setParams } } = useRouteUrlParams();

    useEffect(
        () => {
            if (isNil(params) || isNil(first(toList(params)))) {
                return;
            }

            setParams(params);
        },
        [ params, setParams ],
    );

    return children;
};

const asPage = (ComponentToWrap: FC) => (props: any) => (
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
    <Page>
        {/* eslint-disable-next-line react/react-in-jsx-scope,react/jsx-props-no-spreading */}
        <ComponentToWrap {...props} />
    </Page>
);

export default Page;

export {
    asPage,
};
