import React, { useEffect } from 'react';
import isNil from 'lodash/isNil';

import SubmissionResults from '../../components/submissions/submission-results/SubmissionResults';
import SubmissionDetailsHeading from '../../components/submissions/test-runs/test-run-heading/SubmissionDetailsHeading';
import { useRouteUrlParams } from '../../hooks/common/use-route-url-params';
import { useSubmissionsDetails } from '../../hooks/submissions/use-submissions-details';
import { setLayout } from '../shared/set-layout';

const SubmissionPage = () => {
    const { state: { params } } = useRouteUrlParams();
    const { submissionId } = params;

    const {
        state: { currentSubmission },
        actions: { getDetails },
    } = useSubmissionsDetails();

    useEffect(() => {
        (async () => {
            await getDetails(Number(submissionId));
        })();
    }, [ getDetails, submissionId ]);

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
