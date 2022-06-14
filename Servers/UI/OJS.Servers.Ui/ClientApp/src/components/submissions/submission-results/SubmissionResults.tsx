import * as React from 'react';
import { useCallback } from 'react';
import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';
import { ITestRunDetailsType } from '../../../hooks/submissions/types';
import TestRunDetails from '../test-run-details/TestRunDetails';
import List, { ListType, Orientation } from '../../guidelines/lists/List';

const SubmissionResults = () => {
    const { currentSubmission } = useSubmissionsDetails();

    const renderTestRunsDetails = useCallback((run: ITestRunDetailsType) => (
        <TestRunDetails testRun={run} />
    ), []);

    const renderTestRuns = useCallback(
        () => {
            if (currentSubmission == null) {
                return null;
            }

            return (
                <List
                  values={currentSubmission.testRuns}
                  orientation={Orientation.vertical}
                  itemFunc={renderTestRunsDetails}
                  type={ListType.normal}
                  fullWidth
                />
            );
        },
        [ currentSubmission, renderTestRunsDetails ],
    );

    return (
        <>
            {renderTestRuns()}
        </>
    );
};

export default SubmissionResults;
