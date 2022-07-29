import * as React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
    const { state: { user } } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const { isLoggedIn } = user;
        if (isLoggedIn) {
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
