import IndexPage from '../pageobjects/index-page';
import AuthPage from '../pageobjects/auth-page';
import { cleanData, cleanupAppAndDb, prepareAppAndDb, restoreData } from '../app';

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
    
    before(async () => {
        await prepareAppAndDb();
    });
    
    after(async () => {
        await cleanupAppAndDb();
    });
    
    beforeEach(async () => {
        await restoreData();
        try {
            console.log(' --- Trying to logout ---');
            await AuthPage.performLogOut();
            console.log(' --- Success logout ---');
        } catch (err) {
            console.log(' --- Failed logout ---');
        }
    });

    afterEach(async () => {
        await cleanData();
    });

    it('Expect successful LogIn', async () => {
        await AuthPage.open();
        await loginInWithValidCredentials();

        const myTestsBtn = await AuthPage.myProfileButton;
        await expect(myTestsBtn).toExist();
        await expect(myTestsBtn).toHaveText('MY PROFILE');
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
