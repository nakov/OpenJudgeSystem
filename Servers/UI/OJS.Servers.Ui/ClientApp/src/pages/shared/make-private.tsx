import React, { FC } from 'react';
import {
    Navigate,
    useLocation,
} from 'react-router';

import { Anything } from '../../common/common-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { useAuth } from '../../hooks/use-auth';

type IPrivatePageProps = IHaveChildrenProps

const PrivatePage = ({ children }: IPrivatePageProps) => {
    const { state: { user } } = useAuth();
    const location = useLocation();
    const { isLoggedIn } = user;

    const state = { from: location };

    return !isLoggedIn
        ? <Navigate to="/login" state={state} />
        : (
            <>
                {children}
            </>
        );
};

const makePrivate = (ComponentToWrap: FC) => (props: Anything) => (
    <PrivatePage>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <ComponentToWrap {...props} />
    </PrivatePage>
);

export default PrivatePage;
export {
    makePrivate,
};
