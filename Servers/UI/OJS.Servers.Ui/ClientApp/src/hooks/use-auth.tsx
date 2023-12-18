import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { HttpStatus } from '../common/common';
import { DefaultLoginErrorMessage, EmptyLoginFormErrorMessage } from '../common/constants';
import { IUserPermissionsType, IUserResponseType, IUserType } from '../common/types';
import { IHaveChildrenProps } from '../components/common/Props';
import isNilOrEmpty from '../utils/check-utils';
import { getLoginPath, getLoginSubmitUrl, getLogoutUrl, getUserAuthInfoUrl } from '../utils/urls';

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
        setLoginErrorMessage: (value: string) => void;
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
    const navigate = useNavigate();
    const location = useLocation();

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
                ? DefaultLoginErrorMessage
                : data.toString());

            setIsLoggingIn(false);

            return;
        }

        if (loginSubmitStatus === HttpStatus.Error && isEmpty(username)) {
            setLoginErrorMessage(EmptyLoginFormErrorMessage);
            setIsLoggingIn(false);

            return;
        }

        (async () => {
            await getAuth();
        })();
    }, [
        loginSubmitResponse,
        loginSubmitStatus,
        showError,
        setUserDetails,
        getAuth,
        username,
        loginErrorMessage,
    ]);

    useEffect(() => {
        if (isNil(authInfo)) {
            return;
        }

        setUserDetails(getUserFromResponse(authInfo));
    }, [ authInfo, getUserFromResponse, isGetAuthInfoSuccess, setUserDetails ]);

    // Purpose: Added to prevent flickering Login button while loading
    // If the user is successfully logged in > we first navigate to home
    // then refresh the window to set internal user and header info
    useEffect(() => {
        if (!isLoggingIn &&
            loginSubmitStatus === HttpStatus.Success &&
            location.pathname === getLoginPath()) {
            navigate('/');
            window.location.reload();
        }
    }, [ navigate, loginSubmitStatus, isLoggingIn, location.pathname ]);

    useEffect(() => {
        (async () => {
            await getAuth();
        })();
    }, [ getAuth ]);

    useEffect(() => {
        if (isLoggedIn || loginSubmitStatus === HttpStatus.Success) {
            setIsLoggingIn(false);
        }
    }, [ isLoggedIn, loginSubmitStatus ]);

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
                setLoginErrorMessage,
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
