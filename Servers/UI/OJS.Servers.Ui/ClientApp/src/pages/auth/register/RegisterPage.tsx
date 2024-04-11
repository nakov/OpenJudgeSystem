import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { IAuthorizationReduxState } from '../../../redux/features/authorizationSlice';
import { getPlatformRegisterUrl } from '../../../utils/urls';

const RegisterPage = () => {
    const { isLoggedIn } =
    useSelector((state: {authorization: IAuthorizationReduxState}) => state.authorization);
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
