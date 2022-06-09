import * as React from 'react';
import useCollapse from 'react-collapsed';
import { ReactNode } from 'react';
import { ITestRunDetailsType } from '../../../hooks/submissions/types';
import TestRunDiffView from '../test-run-diff-view/TestRunDiffView';
import styles from './TestRunDetailsCollapsible.module.scss';

interface ITestRunDetailsCollapsibleProps {
    testRun: ITestRunDetailsType;
    header: ReactNode
}

const TestRunDetailsCollapsible = ({ testRun, header }: ITestRunDetailsCollapsibleProps) => {
    const {
        getCollapseProps,
        getToggleProps,
        isExpanded,
    } = useCollapse({ defaultExpanded: testRun.isTrialTest });

    const getResultIsWrongAnswerResultType = () => testRun.resultType === 'WrongAnswer';

    return (
        <div className="collapsible">
            <div className={styles.collapsibleHeader}>
                {header}
                <div
                  className={styles.collapsibleButton}
                  /* eslint-disable-next-line react/jsx-props-no-spreading */
                  {...getToggleProps()}
                >
                    { testRun.isTrialTest && getResultIsWrongAnswerResultType()
                        ? isExpanded
                            ? 'Hide'
                            : 'Details'
                        : null}
                </div>
            </div>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <div {...getCollapseProps()}>
                <div className="content">
                    <TestRunDiffView testRun={testRun} />
                </div>
            </div>
        </div>
    );
};

export default TestRunDetailsCollapsible;
