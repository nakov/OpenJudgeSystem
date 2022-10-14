import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { HttpStatus } from '../common/common';
import { IUserPermissionsType,IUserType } from '../common/types';
import { IHaveChildrenProps } from '../components/common/Props';

import { useHttp } from './use-http';
import { useLoading } from './use-loading';
import { useNotifications } from './use-notifications';
import { useUrls } from './use-urls';

interface IAuthContext {
    state: {
        user: IUserType;
        loginErrorMessage: string;
    };
    actions: {
        signIn: () => void;
        signOut: () => Promise<void>;
        getUser: () => IUserType;
        setUsername: (value: string) => void;
        setPassword: (value: string) => void;
    };
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

interface IAuthProviderProps extends IHaveChildrenProps {
    user: IUserType;
}

const AuthProvider = ({ user, children }: IAuthProviderProps) => {
    const { startLoading, stopLoading } = useLoading();
    const [ internalUser, setInternalUser ] = useState(user);
    const [ username, setUsername ] = useState<string>(user.username);
    const [ password, setPassword ] = useState<string>();
    const [ loginErrorMessage, setLoginErrorMessage ] = useState<string>('');
    const { showError } = useNotifications();

    const { getLogoutUrl, getLoginSubmitUrl } = useUrls();

    const {
        post: loginSubmit,
        response: loginSubmitResponse,
        status: loginSubmitStatus,
    } = useHttp(getLoginSubmitUrl);

    const { post: logout } = useHttp(getLogoutUrl);

    const signIn = useCallback(
        async () => {
            startLoading();
            await loginSubmit({
                Username: username,
                Password: password,
                RememberMe: true,
            });
            stopLoading();
        },
        [ loginSubmit, password, startLoading, stopLoading, username ],
    );

    const signOut = useCallback(async () => {
        startLoading();
        await logout({});
        setInternalUser(user);
        stopLoading();
    }, [ logout, startLoading, stopLoading, user ]);

    const setUserDetails = useCallback((userDetails: IUserType | null) => {
        if (userDetails == null) {
            return;
        }

        setInternalUser(userDetails);
    }, []);

    const getUser = useCallback(
        () => user,
        [ user ],
    );

    useEffect(() => {
        if (loginSubmitResponse) {
            if (loginSubmitStatus === HttpStatus.Unauthorized) {
                setLoginErrorMessage('Invalid username or password.');
                
                return;
            }

            window.location.reload();
        }
    }, [ loginSubmitResponse, loginSubmitStatus, showError, setUserDetails ]);

    const value = {
        state: {
            user: internalUser,
            loginErrorMessage,
        },
        actions: {
            signIn,
            signOut,
            getUser,
            setUsername,
            setPassword,
        },
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export {
    useAuth,
};

export type {
    IUserType,
    IUserPermissionsType,
};

export default AuthProvider;
