import * as React from 'react';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import SubmissionResults from '../../components/submissions/submission-results/SubmissionResults';
import { useSubmissionsDetails } from '../../hooks/submissions/use-submissions-details';
import SubmissionDetailsHeading from '../../components/submissions/test-runs/test-run-heading/SubmissionDetailsHeading';
import { setLayout } from '../shared/set-layout';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IParamsProps {
    submissionId: string
}

const SubmissionPage = () => {
    const { submissionId } = useParams();
    const { setCurrentSubmissionId, getSubmissionDetails } = useSubmissionsDetails();

    useEffect(() => {
        setCurrentSubmissionId(Number(submissionId));
    });

    useEffect(() => {
        (async () => {
            await getSubmissionDetails();
        })();
    }, [ getSubmissionDetails, submissionId ]);

    return (
        <>
            <SubmissionDetailsHeading />
            <SubmissionResults />
        </>
    );
};

export default setLayout(SubmissionPage);
