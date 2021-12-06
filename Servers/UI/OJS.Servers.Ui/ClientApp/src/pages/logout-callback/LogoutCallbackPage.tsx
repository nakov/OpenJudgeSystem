import * as React from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../hooks/use-auth';

const LogoutCallbackPage = () => {
    const history = useHistory();
    const { signOutCallback } = useAuth();

    useEffect(() => {
        signOutCallback();
        history.push('/');
    }, [ history, signOutCallback ]);

    return <></>;
};

export default LogoutCallbackPage;
