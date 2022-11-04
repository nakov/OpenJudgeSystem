import { RedirectExternal } from '../../components/common/RedirectExternal';
import { useUrls } from '../../hooks/use-urls';

const AdministrationPage = () => {
    const { getAdministrationContestsGridUrl } = useUrls();

    return RedirectExternal(getAdministrationContestsGridUrl());
};

export default AdministrationPage;
