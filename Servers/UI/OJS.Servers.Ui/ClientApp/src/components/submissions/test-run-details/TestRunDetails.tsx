import * as React from 'react';
import { ReactNode, useCallback } from 'react';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import { ITestRunDetailsType } from '../../../hooks/submissions/types';
import Collapsible from '../../guidelines/collapsible/Collapsible';
import TestRunDiffView from '../test-run-diff-view/TestRunDiffView';
import { useAuth } from '../../../hooks/use-auth';
import concatClassNames from '../../../utils/class-names';
import IconSize from '../../guidelines/icons/icon-sizes';
import TimeLimitIcon from '../../guidelines/icons/TimeLimitIcon';
import MemoryIcon from '../../guidelines/icons/MemoryIcon';
import styles from './TestRunDetails.module.scss';

interface ITestRunDetailsProps {
    testRun: ITestRunDetailsType;
    testRunIndex: number;
    collapsible: boolean;
}

const TestRunDetails = ({ testRun, testRunIndex }: ITestRunDetailsProps) => {
    const { user } = useAuth();

    const getTestRunHeadingText = (run: ITestRunDetailsType, runIndex: number) => {
        const testRunText = `Test #${runIndex}`;

        if (run.isTrialTest) {
            return `Zero ${testRunText}`;
        }

        return testRunText;
    };

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
                  className={styles.testRunDataParagraphIcon}
                  size={IconSize.Small}
                />
                <span>
                    {testRun.memoryUsed}
                    MB
                </span>
            </p>
        </span>
    ), [ testRun ]);

    const renderCollapsible = useCallback((header: ReactNode, collapsed: boolean) => (
        <Collapsible
          header={header}
          collapsed={collapsed}
        >
            <TestRunDiffView testRun={testRun} />
        </Collapsible>
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

    const renderTrialType = useCallback(() => (
        <div className={styles.testRun}>
            { renderCollapsible(getHeader(), false) }
        </div>
    ), [ getHeader, renderCollapsible ]);

    const renderCompeteType = useCallback(() => (
        <div className={styles.testRun}>
            {
                user.permissions.canAccessAdministration
                    ? renderCollapsible(getHeader(), true)
                    : getHeader()
            }
        </div>
    ), [ getHeader, renderCollapsible, user.permissions.canAccessAdministration ]);

    const render = useCallback(() => {
        if (testRun.isTrialTest) {
            return renderTrialType();
        }

        return renderCompeteType();
    }, [ renderCompeteType, renderTrialType, testRun.isTrialTest ]);

    return render();
};

export default TestRunDetails;
