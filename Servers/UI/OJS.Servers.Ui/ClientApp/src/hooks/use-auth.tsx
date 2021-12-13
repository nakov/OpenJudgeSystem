import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import IHaveChildrenProps from '../components/common/IHaveChildrenProps';
import { useLoading } from './use-loading';
import { useHttp } from './use-http';
import { useNotifications } from './use-notifications';
import { INotificationType } from '../common/types';
import { HttpStatus } from '../common/common';
import { logoutUrl, loginSubmitUrl } from '../utils/urls';

type UserType = {
  username: string,
  isLoggedIn: boolean,
};

interface IAuthContext {
  user: UserType,
  signIn: () => void;
  signOut: () => Promise<void>;
  getUser: () => UserType;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
}

const defaultState = {
    user: {
        username: '',
        isLoggedIn: window.isLoggedIn,
    },
};

const AuthContext = createContext<IAuthContext>(defaultState as IAuthContext);

interface IAuthProviderProps extends IHaveChildrenProps {}

const AuthProvider = ({ children }: IAuthProviderProps) => {
    const { startLoading, stopLoading } = useLoading();
    const [ user, setUser ] = useState<UserType>(defaultState.user);
    const [ username, setUsername ] = useState<string>(defaultState.user.username);
    const [ password, setPassword ] = useState<string>();
    const { showError } = useNotifications();
    const { post: loginSubmitRequest, response: loginSubmitRequestResponse, status: loginSubmitRequestStatus } = useHttp(loginSubmitUrl);
    const { post: logoutRequest, response: logoutResponse } = useHttp(logoutUrl);

    const signIn = useCallback(
        async () => {
            startLoading();
            await loginSubmitRequest({
                Username: username,
                Password: password,
                RememberMe: true,
            });
            stopLoading();
        },
        [ loginSubmitRequest, password, startLoading, stopLoading, username ],
    );

    const signOut = useCallback(async () => {
        startLoading();
        await logoutRequest({});
        stopLoading();
    }, [ logoutRequest, startLoading, stopLoading ]);

    const getUser = useCallback(() => user, [ user ]);

    useEffect(() => {
        setUser({
            username: user.username,
            isLoggedIn: window.isLoggedIn,
        });
    }, [ user.username ]);

    useEffect(() => {
        if (loginSubmitRequestResponse) {
            if (loginSubmitRequestStatus === HttpStatus.Unauthorized) {
                showError({ message: 'Invalid credentials.' } as INotificationType);
                return;
            }

            setUser({
                username: username!,
                isLoggedIn: true,
            });
        }
    }, [ loginSubmitRequestResponse, loginSubmitRequestStatus, showError ]);

    useEffect(() => {
        setUser(defaultState.user);
    }, [ logoutResponse ]);

    const value = {
        user,
        signIn,
        signOut,
        getUser,
        setUsername,
        setPassword,
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

export default AuthProvider;
