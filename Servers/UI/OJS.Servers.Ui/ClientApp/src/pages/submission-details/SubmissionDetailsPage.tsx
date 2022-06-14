import * as React from 'react';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useSubmissionsDetails } from '../../hooks/submissions/use-submissions-details';
import { setLayout } from '../shared/set-layout';
import SubmissionDetails from '../../components/submissions/details/SubmissionDetails';

const SubmissionDetailsPage = () => {
    const { submissionId } = useParams();
    const { getDetails } = useSubmissionsDetails();

    useEffect(() => {
        (async () => {
            await getDetails(Number(submissionId));
        })();
    }, [ getDetails, submissionId ]);

    return (
        <SubmissionDetails />
    );
};

export default setLayout(SubmissionDetailsPage, true);
