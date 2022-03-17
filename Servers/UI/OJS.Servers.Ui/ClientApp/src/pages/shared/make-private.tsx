import * as React from 'react';
import { FC } from 'react';
import { Redirect, useLocation } from 'react-router';
import IHaveChildrenProps from '../../components/common/IHaveChildrenProps';
import { useAuth } from '../../hooks/use-auth';

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
