import IndexPage from '../pageobjects/index-page';
import AuthPage from '../pageobjects/auth-page';

describe('Testing AuthPage', () => {
    const validUserCredentials = {
        username: 'testuser123',
        password: '123456',
    };

    const invalidUserCredentials = {
        username: 'testuser12',
        password: '123456',
    };

    const invalidPasswordCredentials = {
        username: 'testuser123',
        password: '12345',
    };

    const loginWithCredentials = async (credentials) => {
        const { username, password } = credentials;
        await AuthPage.performLogIn(username, password);
        return validUserCredentials;
    };

    const loginInWithValidCredentials = () => loginWithCredentials(validUserCredentials);

    const loginInWithInvalidCredentials = () => loginWithCredentials(invalidUserCredentials);

    beforeEach(async () => {
        try {
            console.log(' --- Trying to logout ---');
            await AuthPage.performLogOut();
            console.log(' --- Success logout ---');
        } catch (err) {
            console.log(' --- Failed logout ---');
        }
    });

    it('Expect successful LogIn', async () => {
        await AuthPage.open();
        await loginInWithValidCredentials();

        const myTestsBtn = await AuthPage.authLoginButton;
        await expect(myTestsBtn).toExist();
    });

    it('Expect logOut button to exist', async () => {
        await AuthPage.open();
        await loginInWithValidCredentials();
        const btn = await AuthPage.authlogoutButton;
        await expect(btn).toExist();
        await expect(btn).toHaveText('LOG OUT');
    });

    it('Expect successful Log out', async () => {
        await AuthPage.open();
        await loginInWithValidCredentials();
        await AuthPage.performLogOut();
        const btn = await IndexPage.logInButton;
        await expect(btn).toExist();
    });
});
