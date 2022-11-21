import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router';
import isNil from 'lodash/isNil';

import { IHaveChildrenProps } from '../../components/common/Props';
import { useInternalUrlParams } from '../../hooks/common/use-internal-url-params';

type IPageWithTitleProps = IHaveChildrenProps

const Page = ({ children }: IPageWithTitleProps) => {
    const params = useParams();
    const { actions: { setParams } } = useInternalUrlParams();

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
        <div>
            {children}
        </div>
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
