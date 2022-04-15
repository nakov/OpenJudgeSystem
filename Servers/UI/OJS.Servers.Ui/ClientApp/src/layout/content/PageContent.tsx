import { Route, Switch } from 'react-router-dom';
import * as React from 'react';
import HomePage from '../../pages/home/HomePage';
import LogoutPage from '../../pages/logout/LogoutPage';
import LoginPage from '../../pages/login/LoginPage';
import RegisterPage from '../../pages/register/RegisterPage';
import ProfilePage from '../../pages/profile/ProfilePage';
import SubmissionPage from '../../pages/submissions/SubmissionPage';
import ContestPage from '../../pages/contests/ContestPage';
import ContestResultsPage from '../../pages/contest-results/ContestResultsPage';
import styles from './PageContent.module.scss';

const PageContent = () => (
    <main className={styles.main}>
        <Switch>
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/register" component={RegisterPage} />
            <Route exact path="/logout" component={LogoutPage} />
            <Route exact path="/" component={HomePage} />
            <Route exact path="/profile" component={ProfilePage} />
            <Route exact path="/submissions/:submissionId" component={SubmissionPage} />
            <Route exact path="/contests/:contestId/:participationType" component={ContestPage} />
            <Route exact path="/contests/:contestId/:participationType/results/:resultType" component={ContestResultsPage} />
        </Switch>
    </main>
);

export default PageContent;
