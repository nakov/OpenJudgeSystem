import { useParams } from 'react-router';
import isNil from 'lodash/isNil';

import { RedirectExternal } from '../../components/common/RedirectExternal';
import { getAdministrationRetestSubmission } from '../../utils/urls';
import withTitle from '../shared/with-title';

const SubmissionRetestPage = () => {
    const params = useParams();
    const { submissionId } = params;
    if (isNil(submissionId)) {
        return null;
    }

    return RedirectExternal(getAdministrationRetestSubmission({ id: parseInt(submissionId, 10) }));
};

export default withTitle(SubmissionRetestPage, (params) => `Retest #${params.submissionId}`);
