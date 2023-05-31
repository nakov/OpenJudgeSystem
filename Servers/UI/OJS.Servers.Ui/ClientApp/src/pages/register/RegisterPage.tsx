import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '../../hooks/use-auth';
import { useUrls } from '../../hooks/use-urls';

const RegisterPage = () => {
    const { state: { user } } = useAuth();
    const navigate = useNavigate();
    const { getPlatformRegisterUrl } = useUrls();

    useEffect(() => {
        if (user.isLoggedIn) {
            navigate('/');
        }

        window.location.href = getPlatformRegisterUrl();
    }, [ getPlatformRegisterUrl, navigate, user ]);

    return (<div />);
};

export default RegisterPage;
