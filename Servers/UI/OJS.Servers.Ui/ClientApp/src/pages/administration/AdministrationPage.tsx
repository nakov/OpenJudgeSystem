import { useEffect } from 'react';
import { useUrls } from '../../hooks/use-urls';


const AdministrationPage = () => {
    const { getAdministrationContestsGridUrl } = useUrls();

    useEffect(() => {
        window.location.replace(getAdministrationContestsGridUrl());
    }, []);

    return null;
};

export default AdministrationPage;