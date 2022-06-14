import * as React from 'react';
import { useCallback } from 'react';
import { ITestRunDetailsType } from '../../../hooks/submissions/types';
import TestRunDetails from '../test-run-details/TestRunDetails';
import List, { ListType, Orientation } from '../../guidelines/lists/List';

interface ISubmissionResultsProps {
    testRuns: ITestRunDetailsType[];
}

const SubmissionResults = ({ testRuns } : ISubmissionResultsProps) => {
    const renderTestRunsDetails = useCallback((run: ITestRunDetailsType) => (
        <TestRunDetails testRun={run} />
    ), []);

    return (
        <List
          values={testRuns}
          orientation={Orientation.vertical}
          itemFunc={renderTestRunsDetails}
          type={ListType.normal}
          fullWidth
        />
    );
};

export default SubmissionResults;
