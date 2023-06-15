import React, { FC, useCallback } from 'react';
import {
    Navigate,
    useLocation,
} from 'react-router';

import { Anything } from '../../common/common-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { useAuth } from '../../hooks/use-auth';

type IPrivatePageProps = IHaveChildrenProps

const PrivatePage = ({ children }: IPrivatePageProps) => {
    const {
        state: {
            isLoggedIn,
            hasCompletedGetAuthInfo,
        },
    } = useAuth();
    const location = useLocation();

    const renderPageOrRedirectToLogin = useCallback(() => {
        // Do not render if has not attempted to load user
        if (!hasCompletedGetAuthInfo) {
            // User still not loaded in state
            return <p>Loading user data...</p>;
        }

        if (!isLoggedIn) {
            const state = { from: location };

            return <Navigate to="/login" state={state} />;
        }

        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{children}</>;
    }, [ hasCompletedGetAuthInfo, location, isLoggedIn, children ]);

    return renderPageOrRedirectToLogin();
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
