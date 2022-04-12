import * as React from 'react';
import { FC } from 'react';
import { Redirect, useLocation } from 'react-router';
import { useAuth } from '../../hooks/use-auth';
import { IHaveChildrenProps } from '../../components/common/Props';

interface IPrivatePageProps extends IHaveChildrenProps {
}

const PrivatePage = ({ children }: IPrivatePageProps) => {
    const { user } = useAuth();
    const location = useLocation();

    return (
        !user.isLoggedIn
            ? (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: location },
                }}
                />
            )
            : (
                <>
                    {children}
                </>
            )
    );
};
const makePrivate = (ComponentToWrap: FC) => (props: any) => (
    <PrivatePage>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <ComponentToWrap {...props} />
    </PrivatePage>
);

export default PrivatePage;
export {
    makePrivate,
};
