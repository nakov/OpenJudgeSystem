import { Route, Routes } from 'react-router-dom';

import { NEW_ADMINISTRATION_PATH } from '../../common/urls';
import AdministrationPortal from '../../components/portals/administration/AdministrationPortal';
import ClientPortal from '../../components/portals/client/ClientPortal';
import { useAppSelector } from '../../redux/store';

const PageContent = () => {
    const { internalUser: user } = useAppSelector((state) => state.authorization);
    return (
        <Routes>
            {user.canAccessAdministration && <Route path={`/${NEW_ADMINISTRATION_PATH}/*`} element={<AdministrationPortal />} />}
            <Route path="/*" element={<ClientPortal />} />
        </Routes>
    );
};

export default PageContent;
