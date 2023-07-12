import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '../../hooks/use-auth';
import { useUrls } from '../../hooks/use-urls';

const RegisterPage = () => {
    const { state: { isLoggedIn } } = useAuth();
    const navigate = useNavigate();
    const { getPlatformRegisterUrl } = useUrls();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }

        window.location.href = getPlatformRegisterUrl();
    }, [ getPlatformRegisterUrl, isLoggedIn, navigate ]);

    return (<div />);
};

export default RegisterPage;
