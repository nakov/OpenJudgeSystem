import * as React from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../hooks/use-auth';

const LoginPage = () => {
    const { user, signIn } = useAuth();
    const history = useHistory();

    useEffect(() => {
        if (user.isLoggedIn) {
            history.push('/');
            return;
        }

        signIn();
    }, [ history, signIn, user ]);

    return <></>;
};

export default LoginPage;
