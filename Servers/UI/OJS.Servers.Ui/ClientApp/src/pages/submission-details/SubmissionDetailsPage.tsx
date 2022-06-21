import * as React from 'react';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { isNil } from 'lodash';
import { useSubmissionsDetails } from '../../hooks/submissions/use-submissions-details';
import { setLayout } from '../shared/set-layout';
import SubmissionDetails from '../../components/submissions/details/SubmissionDetails';

const SubmissionDetailsPage = () => {
    const { submissionId } = useParams();
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

export default setLayout(SubmissionDetailsPage, true);
