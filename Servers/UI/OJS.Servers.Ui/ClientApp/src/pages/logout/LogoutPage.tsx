import * as React from 'react';
import { useHistory } from 'react-router';
import { useEffect } from 'react';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';
import { useAuth } from '../../hooks/use-auth';
import { wait } from '../../utils/promise-utils';

const LogoutPage = () => {
    const { signOut } = useAuth();
    const history = useHistory();

    useEffect(() => {
        (async () => {
            await signOut();
            await wait(0.7);
            history.push('/');
        })();
    }, [ history, signOut ]);

    return (
        <div>You are logged out. You will be redirected to home shortly.</div>
    );
};

export default makePrivate(setLayout(makePrivate(LogoutPage)));
