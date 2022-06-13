import * as React from 'react';
import { ReactNode, useCallback } from 'react';
import { isNil } from 'lodash';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import { ITestRunDetailsType } from '../../../hooks/submissions/types';
import { useAuth } from '../../../hooks/use-auth';
import TestRunDetailsCollapsible from '../test-run-details-collapsible/TestRunDetailsCollapsible';
import concatClassNames from '../../../utils/class-names';
import TimeLimitIcon from '../../guidelines/icons/TimeLimitIcon';
import IconSize from '../../guidelines/icons/icon-sizes';
import MemoryIcon from '../../guidelines/icons/MemoryIcon';
import styles from './TestRunDetails.module.scss';

interface ITestRunDetailsProps {
    testRun: ITestRunDetailsType;
    testRunIndex: number;
    collapsible: boolean;
}

const TestRunDetails = ({ testRun, testRunIndex }: ITestRunDetailsProps) => {
    const { user } = useAuth();

    const getIsCorrectAnswerResultType = useCallback(
        () => testRun.resultType.toLowerCase() === 'correctanswer',
        [ testRun.resultType ],
    );

    const getTestRunHeadingClassName = useCallback(
        () => concatClassNames(
            styles.testRunHeading,
            getIsCorrectAnswerResultType()
                ? styles.correctTestRunHeading
                : styles.wrongTestRunHeading,
        ),
        [ getIsCorrectAnswerResultType ],
    );

    const getIsOutputDiffAvailable = useCallback(
        () => !isNil(testRun.expectedOutputFragment) && testRun.expectedOutputFragment !== '' &&
            !isNil(testRun.userOutputFragment) && testRun.userOutputFragment !== '',
        [ testRun.expectedOutputFragment, testRun.userOutputFragment ],
    );

    const getTestRunHeadingText = (run: ITestRunDetailsType, runIndex: number) => {
        const testRunText = `Test #${runIndex}`;

        if (run.isTrialTest) {
            return `Zero ${testRunText}`;
        }

        return testRunText;
    };

    const renderTimeAndMemoryUsed = useCallback(() => (
        <span className={styles.testRunData}>
            <span className={styles.testRunDataParagraph}>
                <TimeLimitIcon
                  size={IconSize.Small}
                />
                <span>
                    {testRun.timeUsed}
                    s.
                </span>
            </span>
            <span className={styles.testRunDataParagraph}>
                <MemoryIcon
                  size={IconSize.Small}
                />
                <span>
                    {testRun.memoryUsed}
                    MB
                </span>
            </span>
        </span>
    ), [ testRun ]);

    const getHeader = useCallback(
        () => (
            <Heading
              type={HeadingType.small}
              className={getTestRunHeadingClassName()}
            >
                { getTestRunHeadingText(testRun, testRunIndex) }
                { renderTimeAndMemoryUsed() }
            </Heading>
        ),
        [ getTestRunHeadingClassName, renderTimeAndMemoryUsed, testRun, testRunIndex ],
    );

    const renderCollapsible = useCallback((header: ReactNode) => (
        <TestRunDetailsCollapsible
          testRun={testRun}
          header={header}
        />
    ), [ testRun ]);

    const render = useCallback(() => (
        <div className={styles.testRun}>
            {
                getIsOutputDiffAvailable()
                    // See trial test diff if result is incorrect
                    ? (testRun.isTrialTest && !getIsCorrectAnswerResultType()) ||
                    // See any if result is incorrect and user is admin
                      (!getIsCorrectAnswerResultType() && user.permissions.canAccessAdministration)
                        ? renderCollapsible(getHeader())
                        : getHeader()
                    : getHeader()
            }
        </div>
    ), [
        getHeader,
        getIsCorrectAnswerResultType,
        getIsOutputDiffAvailable,
        renderCollapsible,
        testRun,
        user.permissions.canAccessAdministration,
    ]);

    return render();
};

export default TestRunDetails;
