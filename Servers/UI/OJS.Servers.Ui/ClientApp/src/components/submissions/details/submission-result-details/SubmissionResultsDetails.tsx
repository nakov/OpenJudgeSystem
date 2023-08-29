import React from 'react';
import { BiCaretDown, BiCaretUp } from 'react-icons/bi';

import { ITestRunDetailsType } from '../../../../hooks/submissions/types';
import { useHttp } from '../../../../hooks/use-http';
import { getUserAuthInfoUrl } from '../../../../utils/urls';
import IconSize from '../../../guidelines/icons/common/icon-sizes';
import Icon from '../../../guidelines/icons/Icon';
import TestRunDiffView from '../../test-run-diff-view/TestRunDiffView';

import styles from './SubmissionResultsDetails.module.scss';

interface ITestCaseRun {
    id: number;
    checkerComment?: string;
    executionComment?: string;
    expectedOutputFragment?: string;
    input?: string;
    isTrialTest: boolean;
    memoryUsed: number;
    orderBy: number;
    resultType: string;
    showInput: boolean;
    submissionId?: number;
    timeUsed: number;
    userOutputFragment?: string;
}

interface ITestRunDetailsCollapsed {
    [id: string]: {
        isExpanded: boolean;
        detailsExpanded: boolean;
    };
}
interface ISubmissionResultsDetails {
    testRuns?: ITestCaseRun[];
}

interface IUserRole {
    id: string;
    name: string;
}

interface IUserAuthData {
    email: string;
    id: string;
    roles: IUserRole[];
    userName: string;
}

const SubmissionResultsDetails = ({ testRuns }: ISubmissionResultsDetails) => {
    const [ isUserAdmin, setIsUserAdmin ] = React.useState<boolean>(false);
    const [ testRunDetailsCollapsed, setTestRunDetailsCollapsed ] = React.useState<ITestRunDetailsCollapsed>({});

    const { get, data } = useHttp<null, IUserAuthData>({ url: getUserAuthInfoUrl() });

    React.useEffect(() => {
        get();
    }, [ get ]);

    React.useEffect(() => {
        const { roles } = data || {};
        const isUserRoleAdmin = roles?.find((role: IUserRole) => role.name === 'Administrator');

        if (!isUserRoleAdmin) {
            return setIsUserAdmin(false);
        }

        return setIsUserAdmin(true);
    }, [ data ]);

    const renderTestHeading = (testRun: ITestCaseRun, idx: number) => {
        const isWrongAnswer = testRun.resultType === 'WrongAnswer' || testRun.resultType === 'RunTimeError';
        let testRunText = `Test #${testRun.orderBy}`;
        if (testRun.isTrialTest) {
            testRunText = `Zero ${testRunText}`;
        }

        if (isWrongAnswer) {
            if (testRun.resultType === 'RunTimeError') {
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
                      : 'green',
              }}
            >
                {testRunText}
            </h2>
        );
    };

    const renderShowButton = React.useCallback((id: number, isExpanded: boolean) => (
        <button
          type="button"
          className={styles.showInputButton}
          onClick={() => setTestRunDetailsCollapsed({
              ...testRunDetailsCollapsed,
              [id]: {
                  isExpanded: !testRunDetailsCollapsed[id]?.isExpanded,
                  detailsExpanded: testRunDetailsCollapsed[id]?.detailsExpanded,
              },
          })}
        >
            <span>
                {isExpanded
                    ? 'HIDE'
                    : 'SHOW'}
                {' '}
                INPUT
            </span>
            <Icon
              Component={isExpanded
                  ? BiCaretUp
                  : BiCaretDown}
              size={IconSize.Large}
            />
        </button>
    ), [ testRunDetailsCollapsed ]);

    const renderTrialTestData = React.useCallback((test: ITestCaseRun) => {
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
                    <div style={{ margin: '10px 0' }}>
                        <span style={{ backgroundColor: '#fec112', padding: '10px 20px' }}>{ test.input }</span>
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

                { test.executionComment && detailsExpanded && <span>{test.executionComment}</span> }
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
