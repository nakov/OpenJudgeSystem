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

    const compareByOrderByAsc = (tr1: ITestRunDetailsType, tr2: ITestRunDetailsType) => {
        if(tr1.isTrialTest === tr2.isTrialTest)
        {return tr1.orderBy-tr2.orderBy;}

        if(tr1.isTrialTest)
        {return -1;}

        return 1;
    };

    return (
        <List
          values={testRuns.sort(compareByOrderByAsc)}
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
