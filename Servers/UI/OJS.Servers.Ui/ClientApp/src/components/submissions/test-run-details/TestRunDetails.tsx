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
    const [ isCollapsed, setIsCollapsed ] = useState<boolean>(initialIsCollapsed);

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
        const testRunText = `Test #${testRun.orderBy + 1}`;

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
    
    const renderTestRunData = useCallback(() => (
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
                </span>
            </span>
            <span className={styles.testRunDataParagraph}>
                {renderResultTypeLabel()}
            </span>
        </span>
    ), [ testRun, renderResultTypeLabel ]);

    const renderHeader = useCallback(
        () => (
            <Heading
              type={HeadingType.small}
              className={testRunHeadingClassName}
            >
                { testRunHeadingText }
                { renderTestRunData() }
            </Heading>
        ),
        [
            testRunHeadingClassName,
            testRunHeadingText,
            renderTestRunData,
        ],
    );

    const handleToggleCollapsible = useCallback((collapsed: boolean) => {
        setIsCollapsed(collapsed);
    }, []);

    const renderCollapsible = useCallback(() => (
        <>
            <span className={styles.collapsibleHeader}>
                {renderHeader()}
                <ExpandButton
                  collapsedText="Details"
                  expandedText="Hide"
                  expanded={isCollapsed}
                  onExpandChanged={handleToggleCollapsible}
                  className="testRunDetailsExpandBtn"
                />
            </span>
            <Collapsible collapsed={isCollapsed}>
                <TestRunDiffView testRun={testRun} />
            </Collapsible>
        </>
    ), [ renderHeader, handleToggleCollapsible, isCollapsed, testRun ]);

    const render = useCallback(() => {
        if (getResultIsWrongAnswerResultType(testRun) &&
            (user.permissions.canAccessAdministration || testRun.isTrialTest) &&
            isOutputDiffAvailable) {
            return renderCollapsible();
        }

        return renderHeader();
    }, [
        renderHeader,
        isOutputDiffAvailable,
        renderCollapsible,
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
