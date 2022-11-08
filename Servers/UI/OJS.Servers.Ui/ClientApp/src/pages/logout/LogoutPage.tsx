import React, { useEffect } from 'react';

import { useAuth } from '../../hooks/use-auth';
import { wait } from '../../utils/promise-utils';

const LogoutPage = () => {
    const { actions: { signOut } } = useAuth();

    useEffect(() => {
        (async () => {
            await signOut();
            await wait(0.7);
            window.location.href = '/';
        })();
    }, [ signOut ]);

    return (
        <div>You are logged out. You will be redirected to home shortly.</div>
    );
};

export default LogoutPage;
