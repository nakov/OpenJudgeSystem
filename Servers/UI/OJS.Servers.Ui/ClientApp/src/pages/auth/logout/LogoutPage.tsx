import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { resetInInternalUser, setIsLoggedIn } from '../../../redux/features/authorizationSlice';
import { useLogOutMutation } from '../../../redux/services/authorizationService';
import { wait } from '../../../utils/promise-utils';

import styles from './LogoutPage.module.scss';

const LogoutPage = () => {
    const [ logout, { isSuccess } ] = useLogOutMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isSuccess) {
            dispatch(resetInInternalUser());
            dispatch(setIsLoggedIn(false));
        }
    }, [ dispatch, isSuccess ]);

    useEffect(() => {
        (async () => {
            await logout(null);
            await wait(0.7);
            window.location.href = '/';
        })();
    }, [ logout ]);

    return (
        <div className={styles.logout}>
            You are now successfully logged out and will be redirected to home page shortly.
        </div>
    );
};

export default LogoutPage;
