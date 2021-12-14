import * as React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import AuthProvider from './hooks/use-auth';
import PageHeader from './layout/header/PageHeader';
import PageContent from './layout/content/PageContent';
import PageFooter from './layout/footer/PageFooter';
import LoadingProvider from './hooks/use-loading';

import './styles/global.scss';
import ServicesProvider from './hooks/use-services';
import NotificationsProvider from './hooks/use-notifications';

const App = () => (
    <ServicesProvider>
        <LoadingProvider>
            <NotificationsProvider>
                <AuthProvider>
                    <Router>
                        <PageHeader />
                        <PageContent />
                        <PageFooter />
                    </Router>
                </AuthProvider>
            </NotificationsProvider>
        </LoadingProvider>
    </ServicesProvider>
);

export default App;
