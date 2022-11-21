import React, { useEffect, useState } from 'react';
import isNil from 'lodash/isNil';

import SubmissionDetails from '../../components/submissions/details/SubmissionDetails';
import { useInternalUrlParams } from '../../hooks/common/use-internal-url-params';
import { useSubmissionsDetails } from '../../hooks/submissions/use-submissions-details';
import { setLayout } from '../shared/set-layout';
import { asPage } from '../shared/set-page-params';

const SubmissionDetailsPage = () => {
    const { state: { params } } = useInternalUrlParams();
    const { submissionId } = params;
    const {
        state: { currentSubmission },
        actions: {
            getDetails,
            selectSubmissionById,
        },
    } = useSubmissionsDetails();

    const [ selectedSubmissionId, setSelectedSubmissionId ] = useState(currentSubmission?.id);

    useEffect(
        () => {
            if (selectedSubmissionId === submissionId) {
                return;
            }

            setSelectedSubmissionId(Number(submissionId));
        },
        [ selectedSubmissionId, submissionId ],
    );

    useEffect(
        () => {
            if (isNil(selectedSubmissionId)) {
                return;
            }

            selectSubmissionById(selectedSubmissionId);

            (async () => {
                await getDetails(selectedSubmissionId);
            })();
        },
        [ getDetails, selectedSubmissionId, selectSubmissionById ],
    );

    return (
        <SubmissionDetails />
    );
};

export default setLayout(asPage(SubmissionDetailsPage), true);
