import { useParams } from 'react-router';
import isNil from 'lodash/isNil';

import { RedirectExternal } from '../../components/common/RedirectExternal';
import { getAdministrationContestEditUrl } from '../../utils/urls';
import withTitle from '../shared/with-title';

const ContestEditPage = () => {
    const params = useParams();
    const { contestId } = params;
    if (isNil(contestId)) {
        return null;
    }

    return RedirectExternal(getAdministrationContestEditUrl({ id: Number(contestId) }));
};

export default withTitle(ContestEditPage, (params) => `Contest Edit #${params.contestId}`);
