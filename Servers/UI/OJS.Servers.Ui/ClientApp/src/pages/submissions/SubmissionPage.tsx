import * as React from 'react';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import SubmissionResults from '../../components/submissions/submission-results/SubmissionResults';
import { useSubmissionsDetails } from '../../hooks/submissions/use-submissions-details';
import SubmissionDetailsHeading from '../../components/submissions/test-runs/test-run-heading/SubmissionDetailsHeading';
import { setLayout } from '../shared/set-layout';

interface IParamsProps {
    submissionId: string
}

const SubmissionPage = () => {
    const { submissionId } = useParams<IParamsProps>();
    const { setCurrentSubmissionId, getSubmissionDetails } = useSubmissionsDetails();

    useEffect(() => {
        setCurrentSubmissionId(Number(submissionId));
    });

    useEffect(() => {
        getSubmissionDetails();
    }, [ getSubmissionDetails, submissionId ]);

    return (
        <>
            <SubmissionDetailsHeading />
            <SubmissionResults />
        </>
    );
};

export default setLayout(SubmissionPage);
