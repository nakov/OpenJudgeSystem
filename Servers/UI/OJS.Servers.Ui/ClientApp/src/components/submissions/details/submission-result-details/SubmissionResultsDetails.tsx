import React, { useCallback, useEffect, useState } from 'react';

import {
    ISubmissionResultsDetails,
    ITestCaseRun,
    ITestRunDetailsCollapsed,
    ITestRunDetailsType,
    IUserAuthData,
    IUserRole,
} from '../../../../hooks/submissions/types';
import { useHttp } from '../../../../hooks/use-http';
import { getUserAuthInfoUrl } from '../../../../utils/urls';
import Button, { ButtonType } from '../../../guidelines/buttons/Button';
import TestRunDiffView from '../../test-run-diff-view/TestRunDiffView';

import styles from './SubmissionResultsDetails.module.scss';

enum testResultTypes {
    correctAnswer = 'CorrectAnswer',
    wrongAnswer = 'WrongAnswer',
    runTimeError = 'RunTimeError',
    timeLimit = 'TimeLimit',
    memoryLimit = 'MemoryLimit'
}

const SubmissionResultsDetails = ({ testRuns }: ISubmissionResultsDetails) => {
    const [ isUserAdmin, setIsUserAdmin ] = useState<boolean>(false);
    const [ testRunDetailsCollapsed, setTestRunDetailsCollapsed ] = useState<ITestRunDetailsCollapsed>({});

    const { get, data } = useHttp<null, IUserAuthData>({ url: getUserAuthInfoUrl() });

    useEffect(() => {
        get();
    }, [ get ]);

    useEffect(() => {
        const { roles } = data || {};
        const isUserRoleAdmin = roles?.find((role: IUserRole) => role.name === 'Administrator');

        if (!isUserRoleAdmin) {
            return setIsUserAdmin(false);
        }

        return setIsUserAdmin(true);
    }, [ data ]);

    const renderTestHeading = (testRun: ITestCaseRun, idx: number) => {
        const isWrongAnswer = testRun.resultType !== testResultTypes.correctAnswer;

        let testRunText = `Test #${testRun.orderBy}`;
        if (testRun.isTrialTest) {
            testRunText = `Zero ${testRunText}`;
        }

        if (isWrongAnswer) {
            if (testRun.resultType === testResultTypes.runTimeError) {
                testRunText += ' (Compile time Error)';
            } else {
                testRunText += ' (Incorrect Answer)';
            }
        } else {
            testRunText += ' (Correct Answer)';
        }

        return (
            <h2
              id={`test-heading-${idx}`}
              style={{
                  fontSize: 30,
                  margin: '10px 0',
                  color: isWrongAnswer
                      ? '#fc4c50'
                      : '#23be5e',
              }}
            >
                {testRunText}
            </h2>
        );
    };

    const renderShowButton = useCallback((id: number, isExpanded: boolean) => (
        <Button
          type={ButtonType.primary}
          className={styles.showInputButton}
          onClick={() => setTestRunDetailsCollapsed({
              ...testRunDetailsCollapsed,
              [id]: {
                  isExpanded: !testRunDetailsCollapsed[id]?.isExpanded,
                  detailsExpanded: testRunDetailsCollapsed[id]?.detailsExpanded,
              },
          })}
          text={`${isExpanded
              ? 'HIDE'
              : 'SHOW'} INPUT`}
        />
    ), [ testRunDetailsCollapsed ]);

    const renderTrialTestData = useCallback((test: ITestCaseRun) => {
        const { isExpanded, detailsExpanded } = testRunDetailsCollapsed[test.id] || {};

        const testRunDiff = {
            isTrialTest: test.isTrialTest,
            input: test.input,
            showInput: test.showInput,
            expectedOutputFragment: test.expectedOutputFragment,
            userOutputFragment: test.userOutputFragment,
        } as ITestRunDetailsType;

        return (
            <>
                { test.isTrialTest && <div>The zero tests are not included in the final result.</div>}
                { renderShowButton(test.id, isExpanded) }
                { isExpanded && (
                    <div style={{ marginBottom: '15px' }} className={styles.warningBlockWrapper}>
                        <pre>
                            { test.input }
                        </pre>
                    </div>
                ) }
                { test.userOutputFragment && test.expectedOutputFragment && (
                    <div style={{ width: '100%' }}>
                        <TestRunDiffView testRun={testRunDiff} />
                    </div>
                ) }
                { test.executionComment && (
                    <button
                      type="button"
                      className={styles.showDetailsButton}
                      onClick={() => setTestRunDetailsCollapsed({
                          ...testRunDetailsCollapsed,
                          [test.id]: {
                              isExpanded: testRunDetailsCollapsed[test.id]?.isExpanded,
                              detailsExpanded: !testRunDetailsCollapsed[test.id]?.detailsExpanded,
                          },
                      })}
                    >
                        <span>
                            {detailsExpanded
                                ? 'HIDE'
                                : 'SHOW'}
                            {' '}
                            DETAILS
                        </span>
                    </button>
                ) }
                { test.executionComment && detailsExpanded && (
                    <div className={styles.warningBlockWrapper}>
                        <span>{test.executionComment}</span>
                    </div>
                )}
                <div style={{ marginTop: '10px' }}>
                    <div style={{ marginBottom: '5px' }}>
                        Time used:
                        {' '}
                        { test.timeUsed / 1000 }
                        s
                    </div>
                    <div>
                        Memory used:
                        {' '}
                        { test.memoryUsed }
                        {' '}
                        MB
                    </div>
                </div>
            </>
        );
    }, [ testRunDetailsCollapsed, renderShowButton ]);

    return (
        <div className={styles.submissionResultDetailsWrapper}>
            {testRuns?.map((test: ITestCaseRun, idx: number) => (
                <div key={`test-run-details-${test.id}`} className={styles.submissionResultDetails}>
                    {renderTestHeading(test, idx)}
                    {(test.isTrialTest || isUserAdmin) && renderTrialTestData(test)}
                </div>
            ))}
        </div>
    );
};

export default SubmissionResultsDetails;
