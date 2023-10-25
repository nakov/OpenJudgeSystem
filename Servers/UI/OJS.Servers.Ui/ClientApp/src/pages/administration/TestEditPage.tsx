import { useParams } from 'react-router';
import isNil from 'lodash/isNil';

import { RedirectExternal } from '../../components/common/RedirectExternal';
import { getAdministrationTestEditUrl } from '../../utils/urls';

const TestEditPage = () => {
    const params = useParams();
    const { testId } = params;
    if (isNil(testId)) {
        return null;
    }

    return RedirectExternal(getAdministrationTestEditUrl(testId));
};

export default TestEditPage;
