import * as React from 'react';
import { useCallback } from 'react';
import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';
import { ITestRunDetailsType } from '../../../hooks/submissions/types';
import TestRunDetails from '../test-run-details/TestRunDetails';

interface ISubmissionResultsProps {
    collapsible: boolean;
}

const SubmissionResults = ({ collapsible }: ISubmissionResultsProps) => {
    const { currentSubmission } = useSubmissionsDetails();

    const renderTestRunsDetails = useCallback((testRuns: ITestRunDetailsType[]) => testRuns.map((run, index) => (
        <TestRunDetails
          testRun={run}
          testRunIndex={index + 1}
          collapsible={collapsible}
        />
    )), [ collapsible ]);

    const filterRuns = useCallback(
        (trial: boolean) => currentSubmission!.testRuns.filter((tr) => tr.isTrialTest === trial),
        [ currentSubmission ],
    );

    const renderTestRuns = useCallback(
        () => {
            if (currentSubmission == null) {
                return null;
            }

            return (
                <>
                    {renderTestRunsDetails(filterRuns(true))}
                    {renderTestRunsDetails(filterRuns(false))}
                </>
            );
        },
        [ currentSubmission, filterRuns, renderTestRunsDetails ],
    );

    return (
        <>
            {renderTestRuns()}
        </>
    );
};

export default SubmissionResults;
