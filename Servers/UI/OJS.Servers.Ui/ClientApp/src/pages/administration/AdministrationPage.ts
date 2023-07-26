import { RedirectExternal } from '../../components/common/RedirectExternal';
import { getAdministrationContestsGridUrl } from '../../utils/urls';

const AdministrationPage = () => RedirectExternal(getAdministrationContestsGridUrl());

export default AdministrationPage;
