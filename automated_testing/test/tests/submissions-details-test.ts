import IndexPage from '../pageobjects/index-page';
import AuthPage from '../pageobjects/auth-page';
import SubmissionsDetailsPage from '../pageobjects/submissions-details-page';

describe('Testing SubmissionsDetails Page', () => {
    const validUserCredentials = {
        username: 'testuser123',
        password: '123456',
    };

    const loginWithCredentials = async (credentials) => {
        const { username, password } = credentials;
        await AuthPage.performLogIn(username, password);
        return validUserCredentials;
    };

    const loginInWithValidCredentials = () => loginWithCredentials(validUserCredentials);
});
