import React, {
    createContext, useCallback,
    useContext, useEffect, useMemo,
    useState,
} from 'react';
import IHaveChildrenProps from '../components/common/IHaveChildrenProps';
import { useLoading } from './use-loading';
import AuthService from '../services/auth-service';
import { useServices } from './use-services';

type UserType = {
  username: string,
  isLoggedIn: boolean,
};

interface IAuthContext {
  user: UserType,
  signIn: () => void;
  signinRedirectCallback: () => void;
  signOut: () => Promise<void>;
  signOutCallback: () => void;
  signInSilentCallback: () => Promise<void>;
  getToken: () => string | null;
  getUser: () => UserType;
}

const defaultState = {
    user: {
        username: '',
        isLoggedIn: false,
    },
};

const AuthContext = createContext<IAuthContext>(defaultState as IAuthContext);

interface IAuthProviderProps extends IHaveChildrenProps {}

const AuthProvider = ({ children }: IAuthProviderProps) => {
    const { startLoading, stopLoading } = useLoading();
    const [ user, setUser ] = useState<UserType>(defaultState.user);
    const { localStorageService } = useServices();

    const authService = useMemo(
        () => new AuthService(),
        [],
    );

    const signIn = useCallback(
        async () => {
            startLoading();
            await authService.signinRedirect();
            stopLoading();
        },
        [ authService, startLoading, stopLoading ],
    );

    const signinRedirectCallback = useCallback(
        async () => {
            await authService.signInRedirectCallback();
            const loadedUser = await authService.getUser();
            localStorageService.set('user', loadedUser.profile.preferred_username!);
            localStorageService.set('token', loadedUser.access_token);
            setUser({
                username: loadedUser.profile.preferred_username!,
                isLoggedIn: true,
            });
        },
        [ authService, localStorageService ],
    );

    const signInSilentCallback = useCallback(
        async () => {
            startLoading();
            await authService.signInSilentCallback();
            stopLoading();
        },
        [ authService, startLoading, stopLoading ],
    );

    const signOut = useCallback(async () => {
        authService.logout();
    }, [ authService ]);

    const signOutCallback = useCallback(async () => {
        localStorageService.clear();
    }, [ localStorageService ]);

    const getToken = useCallback(() => localStorageService.get('token'), [ localStorageService ]);

    const getUsername = useCallback(() => localStorageService.get('user'), [ localStorageService ]);

    const getUser = useCallback(() => user, [ user ]);

    useEffect(() => {
        setUser({
            username: getUsername(),
            isLoggedIn: !!getToken(),
        });
    }, [ getToken, getUsername ]);

    const value = {
        user,
        signIn,
        signinRedirectCallback,
        signInSilentCallback,
        signOut,
        signOutCallback,
        getToken,
        getUser,
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
