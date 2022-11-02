import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../hooks/use-auth';

const LoginPage = () => {
    const { state: { user } } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const { isLoggedIn } = user;

        if (isLoggedIn) {
            // Needed ignore...
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const origin = location.state?.from?.pathname || '/';

            navigate(origin);
        }
    }, [ location, navigate, user ]);

    return (
        <LoginForm />
    );
};

export default LoginPage;
