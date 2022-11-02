import React, { useCallback } from 'react';

import { ITestRunDetailsType } from '../../../hooks/submissions/types';
import List, { ListType, Orientation } from '../../guidelines/lists/List';
import TestRunDetails from '../test-run-details/TestRunDetails';

interface ISubmissionResultsProps {
    testRuns: ITestRunDetailsType[];
}

const SubmissionResults = ({ testRuns }: ISubmissionResultsProps) => {
    const renderTestRunsDetails = useCallback((run: ITestRunDetailsType) => (
        <TestRunDetails testRun={run} />
    ), []);

    const compareByTestTypeAndOrderByAsc = (tr1: ITestRunDetailsType, tr2: ITestRunDetailsType) => tr1.isTrialTest === tr2.isTrialTest
        ? tr1.orderBy - tr2.orderBy
        : tr1.isTrialTest
            ? -1
            : 1;

    return (
        <List
          values={testRuns.sort(compareByTestTypeAndOrderByAsc)}
          className="submissionTestRunsList"
          itemClassName="testRunDetails"
          orientation={Orientation.vertical}
          itemFunc={renderTestRunsDetails}
          type={ListType.normal}
          fullWidth
        />
    );
};

export default SubmissionResults;
