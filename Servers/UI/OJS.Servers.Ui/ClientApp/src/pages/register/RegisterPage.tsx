import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '../../hooks/use-auth';
import { getPlatformRegisterUrl } from '../../utils/urls';

const RegisterPage = () => {
    const { state: { isLoggedIn } } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }

        window.location.href = getPlatformRegisterUrl();
    }, [ isLoggedIn, navigate ]);

    return (<div />);
};

export default RegisterPage;
