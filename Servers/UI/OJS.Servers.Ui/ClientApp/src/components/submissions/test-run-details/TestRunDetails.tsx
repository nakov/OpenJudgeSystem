import * as React from 'react';
import { ReactNode, useCallback } from 'react';
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

    const getIsCorrectAnswerResultType = (run: ITestRunDetailsType) => run.resultType === 'CorrectAnswer';

    const getTestRunHeadingClassName = useCallback(
        (run: ITestRunDetailsType) => concatClassNames(
            styles.testRunHeading,
            getIsCorrectAnswerResultType(run)
                ? styles.correctTestRunHeading
                : styles.wrongTestRunHeading,
        ),
        [],
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
            <p className={styles.testRunDataParagraph}>
                <TimeLimitIcon
                  size={IconSize.Small}
                />
                <span>
                    {testRun.timeUsed}
                    s.
                </span>
            </p>
            <p className={styles.testRunDataParagraph}>
                <MemoryIcon
                  size={IconSize.Small}
                />
                <span>
                    {testRun.memoryUsed}
                    MB
                </span>
            </p>
        </span>
    ), [ testRun ]);

    const getHeader = useCallback(
        () => (
            <>
                <Heading
                  type={HeadingType.small}
                  className={(() => getTestRunHeadingClassName(testRun))()}
                >
                    { getTestRunHeadingText(testRun, testRunIndex) }
                    {renderTimeAndMemoryUsed()}
                </Heading>
            </>
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
                    user.permissions.canAccessAdministration
                        ? renderCollapsible(getHeader())
                        : getHeader()
                }
        </div>
    ), [ getHeader, renderCollapsible, user.permissions.canAccessAdministration ]);

    return render();
};

export default TestRunDetails;
