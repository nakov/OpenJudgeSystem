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
            isGetAuthInfoUnauthorized,
            hasCompletedGetAuthInfo,
        },
    } = useAuth();
    const location = useLocation();

    const render = useCallback(() => {
        // Do not render if has not attempted to load user or not logged in
        if ((!hasCompletedGetAuthInfo || !isGetAuthInfoUnauthorized) && !isLoggedIn) {
            // User still not loaded in state
            return null;
        }

        if (isGetAuthInfoUnauthorized) {
            const state = { from: location };

            return <Navigate to="/login" state={state} />;
        }

        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{children}</>;
    }, [ hasCompletedGetAuthInfo, isGetAuthInfoUnauthorized, location, isLoggedIn, children ]);

    return render();
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
