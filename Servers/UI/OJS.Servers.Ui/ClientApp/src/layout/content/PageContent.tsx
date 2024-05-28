import { Route, Routes } from 'react-router-dom';

import ClientPortal from '../../components/portals/client/ClientPortal';

const PageContent = () => (
    <Routes>
        <Route path="/*" element={<ClientPortal />} />
    </Routes>
);

export default PageContent;
