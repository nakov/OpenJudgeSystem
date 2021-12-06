import * as React from 'react';
import { useEffect } from 'react';
import { setLayout } from '../shared/set-layout';

import { useAuth } from '../../hooks/use-auth';
import AnonymousUser from '../../components/anonymous-user/AnonymousUser';
import { useSession } from '../../hooks/use-session';

const HomePage = () => {
    const { user } = useAuth();
    const { isSessionLoaded, getSessionId } = useSession();

    const showAnonymousHomePage = () => (
        user.isLoggedIn
            ? null
            : <AnonymousUser />
    );

    const showUserHomePage = () => null;

    useEffect(() => {
        if (user.isLoggedIn && !isSessionLoaded) {
            getSessionId();
        }
    }, [ user, getSessionId, isSessionLoaded ]);

    return (
        <>
            {showAnonymousHomePage()}
            {showUserHomePage()}
        </>
    );
};

export default setLayout(HomePage);
