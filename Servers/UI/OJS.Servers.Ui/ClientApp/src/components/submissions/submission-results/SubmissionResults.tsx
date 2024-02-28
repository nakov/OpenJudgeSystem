import React, { useCallback } from 'react';

import { ITestRunDetailsType } from '../../../hooks/submissions/types';
import List, { ListType, Orientation } from '../../guidelines/lists/List';
import CompilerComment from '../compiler-comment/CompilerComment';
import TestRunDetails from '../test-run-details/TestRunDetails';

interface ISubmissionResultsProps {
    testRuns: ITestRunDetailsType[];
    isCompiledSuccessfully: boolean;
    compilerComment: string;
}

const SubmissionResults = ({ testRuns, isCompiledSuccessfully, compilerComment }: ISubmissionResultsProps) => {
    const { length: testRunsCount } = testRuns.filter((tr) => tr.isTrialTest);
    const renderTestRunsDetails = useCallback((run: ITestRunDetailsType) => (
        <TestRunDetails testRun={run} trialTestsCount={testRunsCount} />
    ), [ testRunsCount ]);

    // eslint-disable-next-line max-len
    // const compareByTestTypeAndOrderByAsc = (tr1: ITestRunDetailsType, tr2: ITestRunDetailsType) => tr1.isTrialTest === tr2.isTrialTest
    //     ? tr1.orderBy - tr2.orderBy
    //     : tr1.isTrialTest
    //         ? -1
    //         : 1;
    return (
        <>
            <CompilerComment compilerComment={compilerComment} isCompiledSuccessfully={isCompiledSuccessfully} />
            <List
              values={testRuns}
              itemClassName="testRunDetails"
              orientation={Orientation.vertical}
              itemFunc={renderTestRunsDetails}
              type={ListType.normal}
            />
        </>
    );
};

export default SubmissionResults;
