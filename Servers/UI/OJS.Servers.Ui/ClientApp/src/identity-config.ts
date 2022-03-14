import { WebStorageStateStore } from 'oidc-client';

const appBaseUrl = window.URLS.UI_URL;
const authorityBaseUrl = process.env.REACT_APP_PLATFORM_IDENTITY_BASE_URL;
const authorityUrl = `${process.env.REACT_APP_PLATFORM_IDENTITY_BASE_URL}${process.env.REACT_APP_PLATFORM_IDENTITY_AUTHORITY_URL_POSTFIX}`;
// eslint-disable-next-line max-len

const IDENTITY_CONFIG = {
    authority: authorityBaseUrl,
    client_id: process.env.REACT_APP_IDENTITY_CLIENT_ID,
    redirect_uri: `${appBaseUrl}/logincallback`,
    login: `${authorityUrl}`,
    automaticSilentRenew: false,
    loadUserInfo: true,
    silent_redirect_uri: `${appBaseUrl}/silentrenew`,
    scope: process.env.REACT_APP_IDENTITY_ALLOWED_SCOPES,
    response_type: process.env.REACT_APP_RESPONSE_TYPE,
    stateStore: new WebStorageStateStore({ store: window.localStorage }),
    canAccessAdministrationCookieName: 'can_access_administration',
    loggedInUsernameCookieName: 'logged_in_username',
};

const METADATA_OIDC = {
    issuer: authorityBaseUrl,
    jwks_uri: `${authorityBaseUrl}/.well-known/jwks`,
    authorization_endpoint: `${authorityUrl}/authorize`,
    token_endpoint: `${authorityUrl}/token`,
    userinfo_endpoint: `${authorityUrl}/userinfo`,
    end_session_endpoint: `${authorityUrl}/endsession`,
    check_session_iframe: `${authorityUrl}/checksession`,
    revocation_endpoint: `${authorityUrl}/revocation`,
    introspection_endpoint: `${authorityUrl}/introspect`,
};

export {
    IDENTITY_CONFIG,
    METADATA_OIDC,
};
