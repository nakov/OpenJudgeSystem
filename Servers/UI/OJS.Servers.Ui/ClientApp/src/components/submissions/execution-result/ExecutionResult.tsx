import * as React from 'react';
import { useCallback } from 'react';
import { ITestRunType } from '../../../hooks/submissions/use-submissions';
import concatClassNames from '../../../utils/class-names';
import { SubmissionResultType } from '../../../common/constants';

import styles from './ExecutionResult.module.scss';

interface IExecutionResultDetailsProps {
    testRuns: ITestRunType[],
}

const classnameToTestRunResultType: { [name: string]: string } = {
    CorrectAnswer: 'fa-check',
    WrongAnswer: 'fa-times',
    TimeLimit: 'fa-clock',
    MemoryLimit: 'fa-archive',
    RunTimeError: 'fa-asterisk',
};

const concatResultTypeIconClassname = (resultType: string): string => concatClassNames(
    'fas',
    classnameToTestRunResultType[resultType],
    resultType === SubmissionResultType.CorrectAnswer
        ? styles.correctAnswerIcon
        : styles.wrongAnswerIcon,
);

const ExecutionResult = ({ testRuns }: IExecutionResultDetailsProps) => {
    const renderRun = useCallback(
        (run: ITestRunType) => (
            <i key={run.id} className={concatResultTypeIconClassname(run.resultType)} />),
        [],
    );

    const renderTestRunIcons = useCallback(
        (runs: ITestRunType[]) => runs.map(renderRun),
        [ renderRun ],
    );

    return (
        <div className={styles.testResultsList}>{renderTestRunIcons(testRuns)}</div>
    );
};

export default ExecutionResult;
