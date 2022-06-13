import * as React from 'react';
import { ReactNode, useState } from 'react';
import { ITestRunDetailsType } from '../../../hooks/submissions/types';
import TestRunDiffView from '../test-run-diff-view/TestRunDiffView';
import { Button, ButtonType } from '../../guidelines/buttons/Button';
import Collapsible from '../../collapsible/Collapsible';
import styles from './TestRunDetailsCollapsible.module.scss';

interface ITestRunDetailsCollapsibleProps {
    testRun: ITestRunDetailsType;
    header: ReactNode
}

const getResultIsWrongAnswerResultType = (testRunResult: string) => testRunResult.toLowerCase() === 'wronganswer';

const TestRunDetailsCollapsible = ({ testRun, header }: ITestRunDetailsCollapsibleProps) => {
    const [ isCollapsed, setIsCollapsed ] = useState<boolean>(testRun.isTrialTest &&
        getResultIsWrongAnswerResultType(testRun.resultType));

    const handleOnClickToggleCollapsible = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            <span className={styles.collapsibleHeader}>
                {header}
                <Button
                  type={ButtonType.plain}
                  onClick={handleOnClickToggleCollapsible}
                  className={styles.collapsibleButton}
                >
                    {isCollapsed
                        ? 'Hide'
                        : 'Details'}
                </Button>
            </span>
            <Collapsible collapsed={isCollapsed}>
                <TestRunDiffView testRun={testRun} />
            </Collapsible>
        </>
    );
};

export default TestRunDetailsCollapsible;
