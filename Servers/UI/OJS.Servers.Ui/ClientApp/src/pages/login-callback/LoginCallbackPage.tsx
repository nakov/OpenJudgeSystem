import * as React from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../hooks/use-auth';

const LoginCallbackPage = () => {
    const { signinRedirectCallback } = useAuth();
    const history = useHistory();

    useEffect(() => {
        signinRedirectCallback();
        history.push('/');
    });

    return <></>;
};

export default LoginCallbackPage;
