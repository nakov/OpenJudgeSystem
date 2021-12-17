import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import AuthProvider from './hooks/use-auth';
import PageHeader from './layout/header/PageHeader';
import PageContent from './layout/content/PageContent';
import PageFooter from './layout/footer/PageFooter';
import LoadingProvider from './hooks/use-loading';
import ServicesProvider from './hooks/use-services';
import NotificationsProvider from './hooks/use-notifications';
import ContestsProvider from './hooks/use-contests';
import UsersProvider from './hooks/use-users';

import './styles/global.scss';
import SubmissionsProvider from './hooks/use-submissions';

const App = () => (
    <ServicesProvider>
        <LoadingProvider>
            <NotificationsProvider>
                <AuthProvider>
                    <UsersProvider>
                        <ContestsProvider>
                            <SubmissionsProvider>
                                <Router>
                                    <PageHeader />
                                    <PageContent />
                                    <PageFooter />
                                </Router>
                            </SubmissionsProvider>
                        </ContestsProvider>
                    </UsersProvider>
                </AuthProvider>
            </NotificationsProvider>
        </LoadingProvider>
    </ServicesProvider>
);

export default App;
