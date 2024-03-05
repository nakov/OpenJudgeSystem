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
    testRuns: ITestRunType[];
    maxMemoryUsed: number;
    maxTimeUsed: number;
    isCompiledSuccessfully: boolean;
    isProcessed: boolean;
}

const ExecutionResult = ({ testRuns, maxMemoryUsed, maxTimeUsed, isCompiledSuccessfully, isProcessed }: IExecutionResultDetailsProps) => {
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

    return (
        <div className={listClassName}>
            { isProcessed && isCompiledSuccessfully
                ? (
                    <div className={styles.executionResultInfo}>
                        <div>
                            {renderTestRunIcons(testRuns)}
                        </div>
                        <div className={styles.timeAndMemoryContainer}>
                            <div className={styles.maxMemoryUsed}>
                                <MemoryIcon />
                                {' '}
                                {(maxMemoryUsed / 1000000).toFixed(2)}
                                {' '}
                                MB
                            </div>
                            <div className={styles.maxTimeUsed}>
                                <TimeLimitIcon />
                                {' '}
                                {maxTimeUsed / 1000}
                                {' '}
                                s.
                            </div>
                        </div>
                    </div>
                )
                : (
                    <ErrorResult />
                )}
        </div>
    );
};

export default ExecutionResult;
