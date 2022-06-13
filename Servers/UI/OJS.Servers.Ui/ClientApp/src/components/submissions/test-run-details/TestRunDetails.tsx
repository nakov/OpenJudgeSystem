import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isNil } from 'lodash';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import { ITestRunDetailsType } from '../../../hooks/submissions/types';
import { useAuth } from '../../../hooks/use-auth';
import concatClassNames from '../../../utils/class-names';
import TimeLimitIcon from '../../guidelines/icons/TimeLimitIcon';
import IconSize from '../../guidelines/icons/icon-sizes';
import MemoryIcon from '../../guidelines/icons/MemoryIcon';
import { Button, ButtonType } from '../../guidelines/buttons/Button';
import Collapsible from '../../guidelines/collapsible/Collapsible';
import TestRunDiffView from '../test-run-diff-view/TestRunDiffView';
import styles from './TestRunDetails.module.scss';

interface ITestRunDetailsProps {
    testRun: ITestRunDetailsType;
    testRunIndex: number;
}

const getResultIsWrongAnswerResultType = (run: ITestRunDetailsType) => run.resultType.toLowerCase() !== 'correctanswer';

const TestRunDetails = ({ testRun, testRunIndex }: ITestRunDetailsProps) => {
    const { user } = useAuth();
    const [ isCollapsed, setIsCollapsed ] = useState<boolean>(testRun.isTrialTest &&
        getResultIsWrongAnswerResultType(testRun));

    const collapsibleButtonText = useMemo(
        () => (isCollapsed
            ? 'Hide'
            : 'Details'),
        [ isCollapsed ],
    );

    const getTestRunHeadingClassName = useCallback(
        () => concatClassNames(
            styles.testRunHeading,
            getResultIsWrongAnswerResultType(testRun)
                ? styles.wrongTestRunHeading
                : styles.correctTestRunHeading,
        ),
        [ testRun ],
    );

    const getIsOutputDiffAvailable = useCallback(
        () => !isNil(testRun.expectedOutputFragment) && testRun.expectedOutputFragment !== '' &&
            !isNil(testRun.userOutputFragment) && testRun.userOutputFragment !== '',
        [ testRun.expectedOutputFragment, testRun.userOutputFragment ],
    );

    const getTestRunHeadingText = useCallback((run: ITestRunDetailsType, runIndex: number) => {
        const testRunText = `Test #${runIndex}`;

        if (run.isTrialTest) {
            return `Zero ${testRunText}`;
        }

        return testRunText;
    }, []);

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

    const renderHeader = useCallback(
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

    const handleOnClickToggleCollapsible = useCallback(() => {
        setIsCollapsed(!isCollapsed);
    }, [ isCollapsed ]);

    const renderCollapsible = useCallback(() => (
        <>
            <span className={styles.collapsibleHeader}>
                {renderHeader()}
                <Button
                  type={ButtonType.plain}
                  onClick={handleOnClickToggleCollapsible}
                  className={styles.collapsibleButton}
                  text={collapsibleButtonText}
                />
            </span>
            <Collapsible collapsed={isCollapsed}>
                <TestRunDiffView testRun={testRun} />
            </Collapsible>
        </>
    ), [
        renderHeader,
        handleOnClickToggleCollapsible,
        collapsibleButtonText,
        isCollapsed,
        testRun,
    ]);

    const render = useCallback(() => {
        if (!getIsOutputDiffAvailable()) {
            return renderHeader();
        }

        if (getResultIsWrongAnswerResultType(testRun) &&
            (user.permissions.canAccessAdministration || testRun.isTrialTest)) {
            return renderCollapsible();
        }

        return renderHeader();
    }, [
        renderHeader,
        getIsOutputDiffAvailable,
        renderCollapsible,
        testRun,
        user.permissions.canAccessAdministration,
    ]);

    useEffect(() => {
        console.log(testRun);
    }, [ testRun ]);

    return (
        <div className={styles.testRun}>
            {render()}
        </div>
    );
};

export default TestRunDetails;
