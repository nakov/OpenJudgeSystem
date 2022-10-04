import { UserManager, WebStorageStateStore } from 'oidc-client';
import { IDENTITY_CONFIG, METADATA_OIDC } from '../identity-config';

class AuthService {
    UserManager;

    constructor() {
        this.UserManager = new UserManager({
            ...IDENTITY_CONFIG,
            userStore: new WebStorageStateStore({ store: window.sessionStorage }),
            metadata: { ...METADATA_OIDC },
        });

        this.UserManager.events.addAccessTokenExpired(() => {
            this.signInSilent();
        });
    }

    signinRedirect = () => {
        localStorage.setItem('redirectUri', window.location.pathname);
        this.UserManager.signinRedirect();
    };

    signInRedirectCallback = async () => {
        await this.UserManager.signinRedirectCallback();
    };

    signInSilent = () => {
        this.UserManager.signinSilent();
    };

    signInSilentCallback = () => {
        this.UserManager.signinSilentCallback();
    };

    getUser = async () => {
        const user = await this.UserManager.getUser();

        if (!user) {
            return this.UserManager.signinRedirectCallback();
        }

        return user;
    };

    logout = () => {
        this.UserManager.signoutRedirect();
        this.UserManager.clearStaleState();
    };
}

export default AuthService;
