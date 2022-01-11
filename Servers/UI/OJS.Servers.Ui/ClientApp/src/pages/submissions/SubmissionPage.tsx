import * as React from 'react';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import Heading from '../../components/guidelines/headings/Heading';
import { useSubmissions } from '../../hooks/use-submissions';
import SubmissionResults from '../../components/submissions/submission-results/SubmissionResults';

interface IParamsProps {
    submissionId: string
}

const SubmissionPage = () => {
    const { submissionId } = useParams<IParamsProps>();
    const { setCurrentSubmissionId, getSubmission } = useSubmissions();

    useEffect(() => {
        setCurrentSubmissionId(Number(submissionId));
    });

    useEffect(() => {
        getSubmission(Number(submissionId));
    }, [ getSubmission, submissionId ]);

    return (
        <>
            <Heading>
                Submission:
                {' '}
                {submissionId}
            </Heading>
            <SubmissionResults />
        </>
    );
};

export default SubmissionPage;
