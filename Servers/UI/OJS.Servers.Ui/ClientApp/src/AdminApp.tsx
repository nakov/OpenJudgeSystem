import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { NEW_ADMINISTRATION_PATH } from './common/urls/administration-urls';
import AdministrationPortal from './components/portals/administration/AdministrationPortal';
import NotFoundPage from './pages/not-found/NotFoundPage';
import store, { persistor, useAppSelector } from './redux/store';

const AdminRoutes = () => {
    const { internalUser: user } = useAppSelector((state) => state.authorization);

    if (!user.canAccessAdministration) {
        return (
            <NotFoundPage />
        );
    }

    return (
        <Routes>
            <Route
              path={`/${NEW_ADMINISTRATION_PATH}/*`}
              element={<AdministrationPortal />}
            />
        </Routes>
    );
};

const AdminApp = () => (
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <Router>
                <AdminRoutes />
            </Router>
        </PersistGate>
    </Provider>
);

export default AdminApp;
