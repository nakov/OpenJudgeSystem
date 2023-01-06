import isNil from 'lodash/isNil';

import { RedirectExternal } from '../../components/common/RedirectExternal';
import { useSubmissionsDetails } from '../../hooks/submissions/use-submissions-details';
import { useUrls } from '../../hooks/use-urls';

const SubmissionRetestPage = () => {
    const { getAdministrationRetestSubmission } = useUrls();
    const { state: { currentSubmission } } = useSubmissionsDetails();

    if (isNil(currentSubmission)) {
        return null;
    }

    return RedirectExternal(getAdministrationRetestSubmission({ id: currentSubmission?.id }));
};

export default SubmissionRetestPage;
