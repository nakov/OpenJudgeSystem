import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '../../hooks/use-auth';

const RegisterPage = () => {
    const { state: { user } } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user.isLoggedIn) {
            navigate('/');
        }

        window.location.href = '';
    }, [ navigate, user ]);

    return (<div />);
};

export default RegisterPage;
