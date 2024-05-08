import React, { useCallback } from 'react';

import { TestRunResultType } from '../../../common/constants';
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
            // TODO: https://github.com/SoftUni-Internal/exam-systems-issues/issues/1287
            case TestRunResultType.CorrectAnswer.toLowerCase(): return <TickIcon key={testRun.id} />;
            case TestRunResultType.WrongAnswer.toLowerCase(): return <WrongAnswerIcon key={testRun.id} />;
            case TestRunResultType.MemoryLimit.toLowerCase(): return <MemoryIcon key={testRun.id} />;
            case TestRunResultType.TimeLimit.toLowerCase(): return <TimeLimitIcon key={testRun.id} />;
            case TestRunResultType.RunTimeError.toLowerCase(): return <RuntimeErrorIcon key={testRun.id} />;
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
