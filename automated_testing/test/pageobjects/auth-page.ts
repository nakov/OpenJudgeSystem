/* eslint-disable class-methods-use-this */
import { ChainablePromiseElement } from 'webdriverio';
import selectors from '../constants/auth-page-selectors';
import Page from './page';

class AuthPage extends Page {
    private pageLocation = '/account/login';

    public get username() {
        return $(selectors.usernameInputSelector);
    }

    public get password() {
        return $(selectors.passwordInputSelector);
    }

    public get authLoginButtonpassword() {
        return $(selectors.authPasswordCheckboxSelector);
    }

    public get authLoginButton() {
        return $(selectors.authLoginButtonSelector);
    }

    public get authlogoutButton() {
        return $(selectors.authLoginButtonSelector);
    }

    public get rememberMeCheckBox() {
        return $(selectors.authRememberMeCheckBoxSelector);
    }

    public get linkForNotRegisteredUsers() {
        return $(selectors.authLinkIfuserIsNoRegistered);
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
        await (await this.authLoginButton).click();
    }

    public async performLogOut() {
        return (await this.authlogoutButton).click();
    }
}
export default new AuthPage();
