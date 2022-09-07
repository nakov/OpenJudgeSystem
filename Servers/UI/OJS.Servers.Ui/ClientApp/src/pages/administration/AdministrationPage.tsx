import { useUrls } from '../../hooks/use-urls';
import { RedirectExternal } from '../../components/common/RedirectExternal'

const AdministrationPage = () => {
    const { getAdministrationContestsGridUrl } = useUrls();

    return RedirectExternal(getAdministrationContestsGridUrl());
};

export default AdministrationPage;