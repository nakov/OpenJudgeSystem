import * as React from 'react';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/use-auth';

const SilentRenewCallbackPage = () => {
    const { signInSilentCallback } = useAuth();

    useEffect(() => {
        signInSilentCallback();
    }, [ signInSilentCallback ]);

    return <></>;
};

export default SilentRenewCallbackPage;
