import { useLocation } from 'react-router-dom';

import UserForm from './form/UserForm';

const AdministrationUser = () => {
    const { pathname } = useLocation();
    const [ , , , userId ] = pathname.split('/');

    return (
        <UserForm id={userId} />
    );
};

export default AdministrationUser;
