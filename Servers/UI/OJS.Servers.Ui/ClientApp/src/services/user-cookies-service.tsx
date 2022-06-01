import { IUserPermissionsType, IUserType } from '../hooks/use-auth';
import { getCookie } from '../utils/cookies';

class UserCookiesService {
    user: IUserType;

    constructor() {
        this.user = {
            username: '',
            isLoggedIn: false,
            permissions: { canAccessAdministration: false } as IUserPermissionsType,
        };
    }

    getUser() {
        const loggedInUsername = getCookie('logged_in_username');
        const canAccessAdministrationCookie = getCookie('can_access_administration');
        let { permissions } = this.user;
        let loggedIn = false;

        if (loggedInUsername) {
            const canAccessAdministration = canAccessAdministrationCookie.length > 0;
            permissions = { canAccessAdministration } as IUserPermissionsType;
            loggedIn = true;
        }

        return {
            username: loggedInUsername,
            isLoggedIn: loggedIn,
            permissions,
        };
    }
}

export default UserCookiesService;
