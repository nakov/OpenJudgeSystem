import React from 'react';
import isNil from 'lodash/isNil';

import SubmissionResults from '../../components/submissions/submission-results/SubmissionResults';
import SubmissionDetailsHeading from '../../components/submissions/test-runs/test-run-heading/SubmissionDetailsHeading';
import { useSubmissionsDetails } from '../../hooks/submissions/use-submissions-details';
import { setLayout } from '../shared/set-layout';

const SubmissionPage = () => {
    const { state: { currentSubmission } } = useSubmissionsDetails();

    if (isNil(currentSubmission)) {
        return <>No details.</>;
    }

    const { testRuns, isCompiledSuccessfully, compilerComment } = currentSubmission;

    return (
        <>
            <SubmissionDetailsHeading />
            <SubmissionResults
              testRuns={testRuns}
              isCompiledSuccessfully={isCompiledSuccessfully}
              compilerComment={compilerComment}
            />
        </>
    );
};

export default setLayout(SubmissionPage);
