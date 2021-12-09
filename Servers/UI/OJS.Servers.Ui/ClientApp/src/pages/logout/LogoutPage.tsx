import * as React from 'react';
import { useHistory } from 'react-router';
import { useEffect } from 'react';
import { wait } from '../../utils/promise-utils';
import { useAuth } from '../../hooks/use-auth';

const LogoutPage = () => {
    const { signOut } = useAuth();
    const history = useHistory();

    useEffect(() => {
        (async () => {
            await signOut();
            await wait(0.7);
            window.location.href = '/';
        })();
    }, [ history, signOut ]);

    return (
        <div>You are logged out. You will be redirected to home shortly.</div>
    );
};

export default LogoutPage;
