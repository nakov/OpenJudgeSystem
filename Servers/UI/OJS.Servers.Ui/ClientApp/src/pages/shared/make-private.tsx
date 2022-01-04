import * as React from 'react';
import { FC, useEffect } from 'react';
import { useHistory } from 'react-router';
import IHaveChildrenProps from '../../components/common/IHaveChildrenProps';
import { useAuth } from '../../hooks/use-auth';

interface IPrivatePageProps extends IHaveChildrenProps {
}

const PrivatePage = ({ children }: IPrivatePageProps) => {
    const { user } = useAuth();
    const history = useHistory();

    useEffect(() => {
        if (!user.isLoggedIn) {
            history.push('/login');
        }
    });

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
