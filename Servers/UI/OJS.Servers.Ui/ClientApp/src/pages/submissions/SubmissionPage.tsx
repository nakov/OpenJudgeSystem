import * as React from 'react';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import SubmissionResults from '../../components/submissions/submission-results/SubmissionResults';
import { useSubmissionsDetails } from '../../hooks/submissions/use-submissions-details';
import SubmissionDetailsHeading from '../../components/submissions/test-runs/test-run-heading/SubmissionDetailsHeading';
import { setLayout } from '../shared/set-layout';

const SubmissionPage = () => {
    const { submissionId } = useParams();
    const { getDetails } = useSubmissionsDetails();

    useEffect(() => {
        (async () => {
            await getDetails(Number(submissionId));
        })();
    }, [ getDetails, submissionId ]);

    return (
        <>
            <SubmissionDetailsHeading />
            <SubmissionResults collapsible={false} />
        </>
    );
};

export default setLayout(SubmissionPage);
