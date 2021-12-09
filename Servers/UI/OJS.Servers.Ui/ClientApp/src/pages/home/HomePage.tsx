import * as React from 'react';
import { setLayout } from '../shared/set-layout';

import { useAuth } from '../../hooks/use-auth';
import AnonymousUser from '../../components/anonymous-user/AnonymousUser';

const HomePage = () => {
    const { user } = useAuth();

    const showAnonymousHomePage = () => (
        user.isLoggedIn
            ? null
            : <AnonymousUser />
    );

    return (
        <>
            {showAnonymousHomePage()}
        </>
    );
};

export default setLayout(HomePage);
