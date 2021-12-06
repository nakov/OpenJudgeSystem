import { Redirect, useLocation } from 'react-router';
import * as React from 'react';
import { FC } from 'react';
import { useAuth } from '../../hooks/use-auth';
import IHaveChildrenProps from '../../components/common/IHaveChildrenProps';

interface IPrivatePageProps extends IHaveChildrenProps {
}

const PrivatePage = ({ children }: IPrivatePageProps) => {
    const { getToken } = useAuth();
    const location = useLocation();
    const token = getToken();

    if (!token) {
        return (
            <Redirect to={{
                pathname: '/login',
                state: { from: location },
            }}
            />
        );
    }

    return (
        <>
            {children}
        </>
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
