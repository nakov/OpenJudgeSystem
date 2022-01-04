import * as React from 'react';
import { ITestRunType } from '../../hooks/use-submissions';
import concatClassNames from '../../utils/class-names';
import styles from './ExecutionResult.module.scss';

interface IExecutionResultDetailsProps {
    testRuns: ITestRunType[],
}

const classnameToTestRunResultType : { [name: string]: string } = {
    CorrectAnswer: 'fa-check',
    WrongAnswer: 'fa-times',
    TimeLimit: 'fa-clock',
    MemoryLimit: 'fa-archive',
    RunTimeError: 'fa-asterisk',
};

const concatResultTypeIconClassname = (resultType: string) : string => concatClassNames(
    'fas',
    classnameToTestRunResultType[resultType],
    resultType === 'CorrectAnswer'
        ? styles.correctAnswerIcon
        : styles.wrongAnswerIcon,
);

const ExecutionResult = ({ testRuns }: IExecutionResultDetailsProps) => {
    // eslint-disable-next-line max-len
    const renderTestRunIcons = (runs: ITestRunType[]) => runs.map((run) => (<i key={run.id} className={concatResultTypeIconClassname(run.resultType)} />));

    return (
        <div className={styles.testResultsList}>{renderTestRunIcons(testRuns)}</div>
    );
};

export default ExecutionResult;
