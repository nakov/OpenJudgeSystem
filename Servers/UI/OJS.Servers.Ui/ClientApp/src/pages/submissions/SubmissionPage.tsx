import * as React from 'react';
import { useParams } from 'react-router';

interface IParamsProps {
    submissionId: string
}

const SubmissionPage = () => {
    const { submissionId } = useParams<IParamsProps>();
    return (
        <h1>
            submission
            {submissionId}
        </h1>
    );
};

export default SubmissionPage;
