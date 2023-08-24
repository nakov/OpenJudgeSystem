import React from 'react';
import { BiCaretDown, BiCaretUp } from 'react-icons/bi';

import { useHttp } from '../../../../hooks/use-http';
import { getUserAuthInfoUrl } from '../../../../utils/urls';
import Button, { ButtonSize, ButtonType } from '../../../guidelines/buttons/Button';
import Collapsible from '../../../guidelines/collapsible/Collapsible';
import IconSize from '../../../guidelines/icons/common/icon-sizes';
import Icon from '../../../guidelines/icons/Icon';
import TestRunDiffView from '../../test-run-diff-view/TestRunDiffView';

import styles from './SubmissionResultsDetails.module.scss';

interface IRole {
    id: string;
    name: string;
}

interface ITestCaseRun {
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

const SubmissionResultsDetails = ({ testRuns }: ISubmissionResultsDetails) => {
    const [ testRunDetailsCollapsed, setTestRunDetailsCollapsed ] = React.useState<ITestRunDetailsCollapsed>({});
    const [ isAdministratorRole, setIsAdministratorRole ] = React.useState<boolean>(false);

    const {
        get,
        data,
    } = useHttp<null, any>({ url: getUserAuthInfoUrl() });

    React.useEffect(() => {
        get();
    });

    React.useEffect(() => {
        if (!data) {
            return;
        }
        const { roles } = data;
        const isAdministrator = roles.filter((role: IRole) => role.name === 'Administrator').length > 0;

        setIsAdministratorRole(isAdministrator);
    }, [ data ]);
    const renderTestHeading = (testRun: any, idx: number) => {
        const isWrongAnswer = testRun.resultType === 'WrongAnswer' || testRun.resultType === 'RunTimeError';
        let testRunText = `Test #${testRun.orderBy}`;
        if (testRun.isTrialTest) {
            testRunText = `Zero ${testRunText}`;
        }

        if (isWrongAnswer) {
            testRunText += ' (Incorrect Answer)';
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

    const renderShowButton = React.useCallback((id: string, isExpanded: boolean) => (
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

    const renderTrialTestData = React.useCallback((test: any) => {
        const { isExpanded, detailsExpanded } = testRunDetailsCollapsed[test.id] || {};

        return (
            <>
                <div>The zero tests are not included in the final result.</div>
                { test.showInput && test.userOutputFragment && test.expectedOutputFragment && renderShowButton(test.id, isExpanded) }
                { test.showInput && test.userOutputFragment && test.expectedOutputFragment && (
                <div className={`${styles.collapsibleContainerWrapper} ${isExpanded
                    ? 'expanded'
                    : 'collapsed'}`}
                >
                    <Collapsible collapsed={isExpanded} className={styles.collapsibleElement}>
                        <TestRunDiffView testRun={test} />
                    </Collapsible>
                </div>
                ) }
                { test.showInput && test.executionComment && (
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
                    {detailsExpanded
                        ? 'HIDE'
                        : 'SHOW'}
                    {' '}
                    DETAILS
                </button>
                ) }

                { test.showInput && test.executionComment && detailsExpanded && <span>{test.executionComment}</span> }
            </>
        );
    }, [ testRunDetailsCollapsed, renderShowButton ]);

    const renderAdministrationButtons = React.useCallback(() => (
        <div className={styles.administrationButtonsWrapper}>
            <Button
              text="EDIT"
              onClick={() => console.log('edit')}
              type={ButtonType.secondary}
              size={ButtonSize.medium}
            />
            <Button
              text="DELETE"
              onClick={() => console.log('delete')}
              type={ButtonType.secondary}
              size={ButtonSize.medium}
            />
            <Button
              text="TESTS"
              onClick={() => console.log('tests')}
              type={ButtonType.secondary}
              size={ButtonSize.medium}
            />
            <Button
              text="AUTHORS PROFILE"
              onClick={() => console.log('authors profile')}
              type={ButtonType.secondary}
              size={ButtonSize.medium}
            />
            <Button
              text="RETEST"
              onClick={() => console.log('retest')}
              type={ButtonType.secondary}
              size={ButtonSize.medium}
            />
        </div>
    ), []);

    return (
        <div className={styles.submissionResultDetailsWrapper}>
            { isAdministratorRole && renderAdministrationButtons() }
            {testRuns?.map((test: any, idx: number) => (
                <div key={`test-run-details-${test.id}`} className={styles.submissionResultDetails}>
                    {renderTestHeading(test, idx)}
                    {test.isTrialTest && renderTrialTestData(test)}
                </div>
            ))}
        </div>
    );
};

export default SubmissionResultsDetails;
