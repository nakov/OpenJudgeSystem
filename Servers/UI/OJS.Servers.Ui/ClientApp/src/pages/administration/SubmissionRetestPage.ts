import isNil from 'lodash/isNil';

import { RedirectExternal } from '../../components/common/RedirectExternal';
import { useSubmissionsDetails } from '../../hooks/submissions/use-submissions-details';
import { getAdministrationRetestSubmission } from '../../utils/urls';

const SubmissionRetestPage = () => {
    const { state: { currentSubmission } } = useSubmissionsDetails();

    if (isNil(currentSubmission)) {
        return null;
    }

    return RedirectExternal(getAdministrationRetestSubmission({ id: currentSubmission?.id }));
};

export default SubmissionRetestPage;
