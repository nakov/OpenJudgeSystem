import { Route, Switch } from 'react-router-dom';
import * as React from 'react';
import HomePage from '../../pages/home/HomePage';
import LogoutPage from '../../pages/logout/LogoutPage';
import LoginPage from '../../pages/login/LoginPage';
import RegisterPage from '../../pages/register/RegisterPage';
import LoginCallbackPage from '../../pages/login-callback/LoginCallbackPage';
import SilentRenewCallbackPage from '../../pages/silent-renew/SilentRenewCallbackPage';
import LogoutCallbackPage from '../../pages/logout-callback/LogoutCallbackPage';
import styles from './PageContent.module.scss';

const PageContent = () => (
    <main className={styles.main}>
        <Switch>
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/register" component={RegisterPage} />
            <Route exact path="/logincallback" component={LoginCallbackPage} />
            <Route exact path="/silentrenew" component={SilentRenewCallbackPage} />
            <Route exact path="/logout" component={LogoutPage} />
            <Route exact path="/logoutcallback" component={LogoutCallbackPage} />
            <Route exact path="/" component={HomePage} />
        </Switch>
    </main>
);

export default PageContent;
