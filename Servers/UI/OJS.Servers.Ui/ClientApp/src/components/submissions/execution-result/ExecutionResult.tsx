import React, { useCallback } from 'react';

import { SubmissionResultType } from '../../../common/constants';
import { ITestRunType } from '../../../hooks/submissions/types';
import useTheme from '../../../hooks/use-theme';
import concatClassNames from '../../../utils/class-names';
import { toLowerCase } from '../../../utils/string-utils';
import ErrorIcon from '../../guidelines/icons/ErrorIcon';
import MemoryIcon from '../../guidelines/icons/MemoryIcon';
import RuntimeErrorIcon from '../../guidelines/icons/RuntimeErrorIcon';
import TickIcon from '../../guidelines/icons/TickIcon';
import TimeLimitIcon from '../../guidelines/icons/TimeLimitIcon';
import WrongAnswerIcon from '../../guidelines/icons/WrongAnswerIcon';

import ErrorResult from './ErrorResult';

import styles from './ExecutionResult.module.scss';

interface IExecutionResultDetailsProps {
    points: number;
    maxPoints: number;
    testRuns: ITestRunType[];
    isCompiledSuccessfully: boolean;
    isProcessed: boolean;
    showDetailedResults: boolean;
}

const ExecutionResult = ({
    points,
    maxPoints,
    testRuns,
    isCompiledSuccessfully,
    isProcessed,
    showDetailedResults,
}: IExecutionResultDetailsProps) => {
    const { getColorClassName, themeColors } = useTheme();

    const renderTestRunIcon = useCallback(
        (testRun: ITestRunType) => {
            switch (toLowerCase(testRun.resultType)) {
            case SubmissionResultType.CorrectAnswer: return <TickIcon key={testRun.id} />;
            case SubmissionResultType.WrongAnswer: return <WrongAnswerIcon key={testRun.id} />;
            case SubmissionResultType.MemoryLimit: return <MemoryIcon key={testRun.id} />;
            case SubmissionResultType.TimeLimit: return <TimeLimitIcon key={testRun.id} />;
            case SubmissionResultType.RunTimeError: return <RuntimeErrorIcon key={testRun.id} />;
            default: return (
                <div>
                    <ErrorIcon />
                    <span className={styles.compileAndUnknownError}>
                        {' '}
                        Something went wrong...
                    </span>
                </div>
            );
            }
        },
        [],
    );

    const renderTestRunIcons = useCallback(
        (runs: ITestRunType[]) => runs.map((testRun) => renderTestRunIcon(testRun)),
        [ renderTestRunIcon ],
    );

    const listClassName = concatClassNames(
        styles.testResultsList,
        getColorClassName(themeColors.textColor),
    );

    const hasTestRuns = useCallback(() => (testRuns && testRuns.length > 0) ?? false, [ testRuns ]);

    const renderResult = useCallback(() => {
        if (isProcessed && !isCompiledSuccessfully) {
            return (<ErrorResult />);
        }

        if (!isProcessed && !isCompiledSuccessfully) {
            return <span>Processing</span>;
        }

        return (
            <div className={styles.executionResultInfo}>
                {
                    showDetailedResults && hasTestRuns() && (
                        <div className={styles.testRunsContainer}>
                            {renderTestRunIcons(testRuns)}
                        </div>
                    )
                }
                <span>
                    {points}
                    {' '}
                    /
                    {maxPoints}
                </span>
            </div>
        );
    }, [ hasTestRuns, isCompiledSuccessfully, isProcessed, maxPoints, points, renderTestRunIcons, showDetailedResults, testRuns ]);

    return (
        <div className={listClassName}>
            {renderResult()}
        </div>
    );
};

export default ExecutionResult;
