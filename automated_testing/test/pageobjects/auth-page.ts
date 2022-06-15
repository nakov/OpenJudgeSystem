/* eslint-disable class-methods-use-this */
import { ChainablePromiseElement } from 'webdriverio';
import selectors from '../constants/auth-page-selectors';
import Page from './page';

class AuthPage extends Page {
    private pageLocation = '/login';

    public get username() {
        return $(selectors.usernameInputSelector);
    }

    public get password() {
        return $(selectors.passwordInputSelector);
    }

    public get authLoginButtonpassword() {
        return $(selectors.authPasswordCheckboxSelector);
    }

    public get authNavLoginButton() {
        return $(selectors.authLoginButtonNavBarSelector);
    }

    public get authFormLoginButton() {
        return $(selectors.authLoginButtonFormSelector);
    }

    public get authlogoutButton() {
        return $(selectors.authNavLogOutBtnSelector);
    }

    public get rememberMeCheckBox() {
        return $(selectors.authRememberMeCheckBoxSelector);
    }

    public get linkForNotRegisteredUsers() {
        return $(selectors.authLinkIfuserIsNoRegistered);
    }

    public get myProfileButton() {
        return $(selectors.authNavigationMyProfileBtn);
    }

    public open(): Promise<string> {
        return super.open(this.pageLocation);
    }

    public async enterUsername(input) {
        return (await this.username).setValue(input);
    }

    public async enterPassword(input) {
        return (await this.password).setValue(input);
    }

    public async performLogIn(username, password) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await (await this.authFormLoginButton).click();
    }

    public async performLogOut() {
        return (await this.authlogoutButton).click();
    }
}
export default new AuthPage();
