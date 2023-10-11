import React, { useCallback } from 'react';

import { SubmissionResultType } from '../../../common/constants';
import { ITestRunType } from '../../../hooks/submissions/types';
import { toLowerCase } from '../../../utils/string-utils';
import ErrorIcon from '../../guidelines/icons/ErrorIcon';
import MemoryIcon from '../../guidelines/icons/MemoryIcon';
import RuntimeErrorIcon from '../../guidelines/icons/RuntimeErrorIcon';
import TickIcon from '../../guidelines/icons/TickIcon';
import TimeLimitIcon from '../../guidelines/icons/TimeLimitIcon';
import WrongAnswerIcon from '../../guidelines/icons/WrongAnswerIcon';

import styles from './ExecutionResult.module.scss';

interface IExecutionResultDetailsProps {
    testRuns: ITestRunType[];
    maxMemoryUsed: number;
    maxTimeUsed: number;
    isCompiledSuccessfully: boolean;
}

const ExecutionResult = ({ testRuns, maxMemoryUsed, maxTimeUsed, isCompiledSuccessfully }: IExecutionResultDetailsProps) => {
    const renderTestRunIcon = useCallback(
        (testRun: ITestRunType) => {
            switch (toLowerCase(testRun.resultType)) {
            case SubmissionResultType.CorrectAnswer: return <TickIcon key={testRun.id} />;
            case SubmissionResultType.WrongAnswer: return <WrongAnswerIcon key={testRun.id} />;
            case SubmissionResultType.MemoryLimit: return <MemoryIcon key={testRun.id} />;
            case SubmissionResultType.TimeLimit: return <TimeLimitIcon key={testRun.id} />;
            case SubmissionResultType.RunTimeError: return <RuntimeErrorIcon key={testRun.id} />;
            default: return <div>Something went wrong...</div>;
            }
        },
        [],
    );

    const renderTestRunIcons = useCallback(
        (runs: ITestRunType[]) => runs.map((testRun) => renderTestRunIcon(testRun)),
        [ renderTestRunIcon ],
    );

    return (
        isCompiledSuccessfully
            ? (
                <div className={styles.testResultsList}>
                    <div className={styles.testRunIcons}>{renderTestRunIcons(testRuns)}</div>
                    <div>
                        <MemoryIcon />
                        {' '}
                        {(maxMemoryUsed / 1000000).toFixed(2)}
                        {' '}
                        MB
                    </div>
                    <div>
                        <TimeLimitIcon />
                        {' '}
                        {maxTimeUsed / 1000}
                        {' '}
                        s.
                    </div>
                </div>
            )
            : (
                <div className={styles.testResultsList}>
                    <ErrorIcon />
                    <span>
                        {' '}
                        Compile time error
                    </span>
                </div>
            )
    );
};

export default ExecutionResult;
