import * as React from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../hooks/use-auth';
import { authorityRegisterFullUrl } from '../../utils/urls';

const RegisterPage = () => {
    const { user } = useAuth();
    const history = useHistory();

    useEffect(() => {
        if (user.isLoggedIn) {
            history.push('/');
        }

        window.location.href = authorityRegisterFullUrl;
    }, [ history, user ]);

    return <></>;
};

export default RegisterPage;
