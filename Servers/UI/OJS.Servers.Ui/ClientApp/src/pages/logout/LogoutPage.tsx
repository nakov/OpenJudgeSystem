import React, { useEffect } from 'react';

import { useAuth } from '../../hooks/use-auth';
import { wait } from '../../utils/promise-utils';

import styles from './LogoutPage.module.scss';

const LogoutPage = () => {
    const { actions: { signOut } } = useAuth();

    useEffect(() => {
        (async () => {
            await signOut();
            await wait(0.7);
            window.location.href = '/';
        })();
    }, [ signOut ]);

    return (
        <div className={styles.logout}>
            You are logged out and will be redirected to home shortly.
        </div>
    );
};

export default LogoutPage;
