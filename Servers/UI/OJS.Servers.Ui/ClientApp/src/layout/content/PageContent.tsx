import { Route, Switch } from 'react-router-dom';
import * as React from 'react';
import HomePage from '../../pages/home/HomePage';
import LogoutPage from '../../pages/logout/LogoutPage';
import LoginPage from '../../pages/login/LoginPage';
import RegisterPage from '../../pages/register/RegisterPage';
import styles from './PageContent.module.scss';
import ProfilePage from '../../pages/profile/ProfilePage';

const PageContent = () => (
    <main className={styles.main}>
        <Switch>
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/register" component={RegisterPage} />
            <Route exact path="/logout" component={LogoutPage} />
            <Route exact path="/" component={HomePage} />
            <Route exact path="/profile" component={ProfilePage} />
        </Switch>
    </main>
);

export default PageContent;
