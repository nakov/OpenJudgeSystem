import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { HttpStatus } from '../common/common';
import { IUserPermissionsType, IUserResponseType, IUserType } from '../common/types';
import { IHaveChildrenProps } from '../components/common/Props';
import isNilOrEmpty from '../utils/check-utils';
import {
    getLoginSubmitUrl,
    getLogoutUrl,
    getUserAuthInfoUrl,
} from '../utils/urls';

import { useHttp } from './use-http';
import { useNotifications } from './use-notifications';

interface IAuthContext {
    state: {
        user: IUserType;
        loginOrGetAuthInitiated: boolean;
        hasCompletedGetAuthInfo: boolean;
        isLoggedIn: boolean;
        isLoggingIn: boolean;
        loginErrorMessage: string;
    };
    actions: {
        signIn: () => void;
        signOut: () => Promise<void>;
        loadAuthInfo: () => Promise<void>;
        setUsername: (value: string) => void;
        setPassword: (value: string) => void;
        setIsLoggingIn: (value:boolean) => void;
    };
}

const defaultState = {
    user: {
        id: '',
        username: '',
        email: '',
        permissions: { canAccessAdministration: false } as IUserPermissionsType,
        isInRole: false,
        isAdmin: false,
    },
};

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

type IAuthProviderProps = IHaveChildrenProps

enum UserRoles {
    Lecturer = 'Lecturer',
    Administrator = 'Administrator'
}

interface ILoginDetailsType {
    Username: string;
    Password?: string;
    RememberMe: boolean;
}

const AuthProvider = ({ children }: IAuthProviderProps) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isLoggingIn, setIsLoggingIn ] = useState(false);
    const [ internalUser, setInternalUser ] = useState<IUserType>(defaultState.user);
    const [ username, setUsername ] = useState<string>('');
    const [ password, setPassword ] = useState<string>();
    const [ loginErrorMessage, setLoginErrorMessage ] = useState<string>('');
    const { showError } = useNotifications();
    const defaultLoginErrorMessage = useMemo(() => 'Invalid username or password', []);

    const {
        post: loginSubmit,
        response: loginSubmitResponse,
        status: loginSubmitStatus,
    } = useHttp<null, string, ILoginDetailsType>({ url: getLoginSubmitUrl });

    const {
        get: getAuthInfo,
        data: authInfo,
        isSuccess: isGetAuthInfoSuccess,
        status: getAuthInfoStatus,
    } = useHttp<null, IUserResponseType, null>({ url: getUserAuthInfoUrl });

    const { post: logout } = useHttp({ url: getLogoutUrl });

    const loginOrGetAuthInitiated = useMemo(
        () => getAuthInfoStatus !== HttpStatus.NotStarted ||
        loginSubmitStatus !== HttpStatus.NotStarted,
        [ getAuthInfoStatus, loginSubmitStatus ],
    );

    const hasCompletedGetAuthInfo = useMemo(
        () => getAuthInfoStatus !== HttpStatus.NotStarted &&
            getAuthInfoStatus !== HttpStatus.Pending && isGetAuthInfoSuccess,
        [ getAuthInfoStatus, isGetAuthInfoSuccess ],
    );

    const isLoggedIn = useMemo(
        () => isGetAuthInfoSuccess && !isEmpty(internalUser.id),
        [ internalUser.id, isGetAuthInfoSuccess ],
    );

    const getAuth = useCallback(async () => {
        // If we are already logged in,
        // initiated getAuth or login request,
        // don't try to get auth info again
        if (loginOrGetAuthInitiated || isLoggedIn) {
            return;
        }

        await getAuthInfo();
    }, [ getAuthInfo, isLoggedIn, loginOrGetAuthInitiated ]);

    const getUserFromResponse = useCallback((authInfoResponse: IUserResponseType) => {
        if (isNil(authInfoResponse)) {
            return defaultState.user;
        }

        const isAdmin = isEmpty(authInfoResponse.roles)
            ? false
            : !isNil(authInfoResponse?.roles
                .find((role) => role.name.toLowerCase() === UserRoles.Administrator.toLowerCase()));

        const isLecturer = isEmpty(authInfoResponse.roles)
            ? false
            : !isNil(authInfoResponse?.roles
                .find((role) => role.name.toLowerCase() === 'lecturer'));

        const isInRole = !isEmpty(authInfoResponse.roles);

        return {
            id: authInfoResponse.id,
            username: authInfoResponse.userName,
            email: authInfoResponse.email,
            permissions: { canAccessAdministration: isAdmin || isLecturer } as IUserPermissionsType,
            isInRole,
            isLecturer,
            isAdmin,
        } as IUserType;
    }, []);

    const setUserDetails = useCallback((userDetails: IUserType) => {
        setInternalUser(userDetails);
    }, []);

    const signIn = useCallback(
        async () => {
            setIsLoggingIn(true);
            setIsLoading(true);
            await loginSubmit({
                Username: username,
                Password: password,
                RememberMe: true,
            });
            setIsLoading(false);
        },
        [ loginSubmit, password, username ],
    );

    const signOut = useCallback(async () => {
        setIsLoading(true);
        await logout();
        setUserDetails(defaultState.user);
        setIsLoading(false);
    }, [ logout, setUserDetails ]);

    useEffect(() => {
        if (isNil(loginSubmitResponse)) {
            return;
        }

        if (loginSubmitStatus === HttpStatus.Unauthorized) {
            const { data } = loginSubmitResponse;

            setLoginErrorMessage(isNil(data) || isEmpty(data)
                ? defaultLoginErrorMessage
                : data.toString());

            return;
        }

        (async () => {
            await getAuth();
        })();

        window.location.reload();
    }, [
        loginSubmitResponse,
        loginSubmitStatus,
        showError,
        setUserDetails,
        defaultLoginErrorMessage,
        getAuth,
    ]);

    useEffect(() => {
        if (isNil(authInfo)) {
            return;
        }

        setUserDetails(getUserFromResponse(authInfo));
    }, [ authInfo, getUserFromResponse, isGetAuthInfoSuccess, setUserDetails ]);

    useEffect(() => {
        (async () => {
            await getAuth();
        })();
    }, [ getAuth ]);

    useEffect(() => {
        if (isLoggedIn) {
            setIsLoggingIn(false);
        }
    }, [ isLoggedIn ]);

    useEffect(() => {
        if (!isNilOrEmpty(authInfo) && !isLoggedIn) {
            setIsLoggingIn(true);
        }
    }, [ authInfo, isLoggedIn ]);

    const value = useMemo(
        () => ({
            state: {
                user: internalUser,
                loginOrGetAuthInitiated,
                hasCompletedGetAuthInfo,
                isLoggedIn,
                isLoggingIn,
                loginErrorMessage,
                isLoading,
            },
            actions: {
                signIn,
                signOut,
                setIsLoggingIn,
                loadAuthInfo: getAuth,
                setUsername,
                setPassword,
            },
        }),
        [
            getAuth,
            hasCompletedGetAuthInfo,
            internalUser,
            isLoggingIn,
            isLoggedIn,
            loginErrorMessage,
            loginOrGetAuthInitiated,
            signIn,
            signOut,
            isLoading,
        ],
    );

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
