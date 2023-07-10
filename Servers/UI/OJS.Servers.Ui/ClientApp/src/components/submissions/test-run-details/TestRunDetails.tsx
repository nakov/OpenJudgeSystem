import React, { useCallback, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { SubmissionResultType } from '../../../common/constants';
import { ITestRunDetailsType } from '../../../hooks/submissions/types';
import { useAuth } from '../../../hooks/use-auth';
import concatClassNames from '../../../utils/class-names';
import { splitByCapitalLetter, toLowerCase } from '../../../utils/string-utils';
import ExpandButton from '../../guidelines/buttons/ExpandButton';
import Collapsible from '../../guidelines/collapsible/Collapsible';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import IconSize from '../../guidelines/icons/common/icon-sizes';
import MemoryIcon from '../../guidelines/icons/MemoryIcon';
import TimeLimitIcon from '../../guidelines/icons/TimeLimitIcon';
import Label, { LabelType } from '../../guidelines/labels/Label';
import TestRunDiffView from '../test-run-diff-view/TestRunDiffView';

import styles from './TestRunDetails.module.scss';

interface ITestRunDetailsProps {
    testRun: ITestRunDetailsType;
}

const getResultIsWrongAnswerResultType = (run: ITestRunDetailsType) => toLowerCase(run.resultType) !== SubmissionResultType.CorrectAnswer;

const TestRunDetails = ({ testRun }: ITestRunDetailsProps) => {
    const { state: { user } } = useAuth();
    const initialIsCollapsed = testRun.isTrialTest && getResultIsWrongAnswerResultType(testRun);
    const [ isTestRunDetailCollapsed, setIsTestRunDetailCollapsed ] = useState<boolean>(initialIsCollapsed);
    const [ isTestInputCollapsed, setIsTestInputCollapsed ] = useState<boolean>(false);

    const testRunHeadingClass = 'testRunHeading';
    const testRunHeadingClassName = useMemo(
        () => concatClassNames(
            styles.testRunHeading,
            testRunHeadingClass,
            getResultIsWrongAnswerResultType(testRun)
                ? styles.wrongTestRunHeading
                : styles.correctTestRunHeading,
        ),
        [ testRun ],
    );

    const isOutputDiffAvailable = useMemo(
        () => !isNil(testRun.expectedOutputFragment) && testRun.expectedOutputFragment !== '' &&
            !isNil(testRun.userOutputFragment) && testRun.userOutputFragment !== '',
        [ testRun.expectedOutputFragment, testRun.userOutputFragment ],
    );

    const testRunHeadingText = useMemo(() => {
        const testRunText = `Test #${testRun.orderBy}`;

        if (testRun.isTrialTest) {
            return `Zero ${testRunText}`;
        }

        return testRunText;
    }, [ testRun ]);

    const renderResultTypeLabel = useCallback(
        () => {
            const result = toLowerCase(testRun.resultType);
            const type = result === SubmissionResultType.CorrectAnswer
                ? LabelType.success
                : result === SubmissionResultType.WrongAnswer
                    ? LabelType.danger
                    : LabelType.warning;

            const resultSplit = splitByCapitalLetter(testRun.resultType);

            return (
                <Label type={type}>
                    {resultSplit}
                </Label>
            );
        },
        [ testRun ],
    );

    const handleCollapsibleTestInput = useCallback((collapsed: boolean) => {
        setIsTestInputCollapsed(collapsed);
    }, []);

    const renderCollapsibleTestInput = useCallback(() => (
        <span className={styles.testRunDetailsCollapsible}>
            <ExpandButton
              collapsedText="Show input"
              expandedText="Hide input"
              expanded={isTestInputCollapsed}
              onExpandChanged={handleCollapsibleTestInput}
              className="testRunDetailsExpandBtn"
            />
            <Collapsible collapsed={isTestInputCollapsed}>
                {testRun.input}
            </Collapsible>
        </span>
    ), [ handleCollapsibleTestInput, isTestInputCollapsed, testRun ]);

    const renderTestRunData = useCallback(() => (
        <span className={styles.testRunData}>
            <span className={styles.testRunDataParagraph}>
                <TimeLimitIcon
                  size={IconSize.Medium}
                />
                <span>
                    {testRun.timeUsed}
                    s.
                </span>
            </span>
            <span className={styles.testRunDataParagraph}>
                <MemoryIcon
                  size={IconSize.Medium}
                />
                <span>
                    {testRun.memoryUsed}
                </span>
            </span>
            {testRun.showInput
                ? renderCollapsibleTestInput()
                : null}
            <span className={styles.testRunDataParagraph}>
                {renderResultTypeLabel()}
            </span>
        </span>
    ), [ testRun, renderResultTypeLabel, renderCollapsibleTestInput ]);

    const renderHeader = useCallback(
        () => (
            <>
                <Heading
                  type={HeadingType.small}
                  className={testRunHeadingClassName}
                >
                    { testRunHeadingText }
                </Heading>
                { renderTestRunData() }
            </>
        ),
        [
            testRunHeadingClassName,
            testRunHeadingText,
            renderTestRunData,
        ],
    );

    const handleTestRunDetailsToggleCollapsible = useCallback((collapsed: boolean) => {
        setIsTestRunDetailCollapsed(collapsed);
    }, []);

    const renderTestRunDetailsCollapsible = useCallback(() => (
        <>
            <span className={styles.collapsibleHeader}>
                {renderHeader()}
                <ExpandButton
                  collapsedText="Details"
                  expandedText="Hide"
                  expanded={isTestRunDetailCollapsed}
                  onExpandChanged={handleTestRunDetailsToggleCollapsible}
                  className="testRunDetailsExpandBtn"
                />
            </span>
            <Collapsible collapsed={isTestRunDetailCollapsed}>
                <TestRunDiffView testRun={testRun} />
            </Collapsible>
        </>
    ), [ renderHeader, handleTestRunDetailsToggleCollapsible, isTestRunDetailCollapsed, testRun ]);

    const render = useCallback(() => {
        if (getResultIsWrongAnswerResultType(testRun) &&
            (user.permissions.canAccessAdministration || testRun.isTrialTest) &&
            isOutputDiffAvailable) {
            return renderTestRunDetailsCollapsible();
        }

        return renderHeader();
    }, [
        renderHeader,
        isOutputDiffAvailable,
        renderTestRunDetailsCollapsible,
        testRun,
        user.permissions.canAccessAdministration,
    ]);

    return (
        <div className={styles.testRun}>
            {render()}
        </div>
    );
};

export default TestRunDetails;
