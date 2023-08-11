import React from 'react';
import Icon from '../../../guidelines/icons/Icon';

import { BiCaretDown, BiCaretUp } from "react-icons/bi";
import IconSize from "../../../guidelines/icons/common/icon-sizes";
import TestRunDiffView from "../../test-run-diff-view/TestRunDiffView";
import Collapsible from "../../../guidelines/collapsible/Collapsible";

import styles from '../SubmissionDetails.module.scss';
interface ISubmissionResultsDetails {
    testRuns?: any[]
}

const SubmissionResultsDetails = ({ testRuns }: ISubmissionResultsDetails) => {
    const [ testRunDetailsCollapsed, setTestRunDetailsCollapsed ] = React.useState<object>({});
    const renderTestHeading = (testRun: any, idx: number) => {
        const isWrongAnswer = testRun.resultType === 'WrongAnswer' || 'RunTimeError';
        let testRunText = `Test #${testRun.orderBy}`;
        if (testRun.isTrialTest) {
            testRunText = `Zero ${testRunText}`;
        }
        
        isWrongAnswer ? testRunText += ' (Incorrect Answer)' : testRunText += ' (Correct Answer)'

        return (<h2 id={`test-heading-${idx}`} style={{fontSize: 30, margin: '10px 0',color: isWrongAnswer ? '#fc4c50' : 'green'}}>
            {testRunText}
        </h2>);
    };
    
    const renderShowButton = React.useCallback((id: string, isExpanded: boolean) => {
        return(<div className={styles.showInputButton} onClick={() => setTestRunDetailsCollapsed({
            ...testRunDetailsCollapsed,
            [id]: {
                    'isExpanded': !testRunDetailsCollapsed[id]?.isExpanded,
                    'detailsExpanded': testRunDetailsCollapsed[id]?.detailsExpanded
                }
        })}>
            <span>{isExpanded ? 'HIDE' : 'SHOW'} INPUT</span>
            <Icon Component={isExpanded ? BiCaretUp : BiCaretDown} size={IconSize.Large} className={styles.iconActiveColor} />
        </div>)
    }, [testRunDetailsCollapsed]);
    
    const renderTrialTestData = React.useCallback((test: any) => {
        const { isExpanded, detailsExpanded } = testRunDetailsCollapsed[test.id] || {};
        
        return(<>
            <div className={styles.zeroTestDescription}>The zero tests are not included in the final result.</div>
            {test.showInput && renderShowButton(test.id, isExpanded)}
            {test.showInput && (<div className={`${styles.collapsibleContainerWrapper} ${isExpanded ? 'expanded' : 'collapsed'}`}>
                <Collapsible collapsed={isExpanded} className={styles.collapsibleElement}>
                    <TestRunDiffView testRun={test} />
                </Collapsible>
                { test.executionComment && (<div 
                    className={styles.showDetailsButton} 
                    onClick={() => setTestRunDetailsCollapsed({
                        ...testRunDetailsCollapsed,
                        [test.id]: {
                            'isExpanded': testRunDetailsCollapsed[test.id]?.isExpanded,
                            'detailsExpanded': !testRunDetailsCollapsed[test.id]?.detailsExpanded
                        }
                })}>Show Details</div>) }
            </div>)}
            
            { detailsExpanded && <span className={styles.executionComment}>{test.executionComment}</span> }
        </>);
    }, [testRunDetailsCollapsed]);
    
    return(<div className={styles.submissionResultDetailsWrapper}>
        {testRuns?.map((test: any, idx: number) => {
            return(<div key={`test-run-details-${test.id}`} className={styles.submissionResultDetails}>
                {renderTestHeading(test, idx)}
                {test.isTrialTest && renderTrialTestData(test)}
                {test.showInput && test.executionComment && <span className={styles.executionComment}>{test.executionComment}</span>}
            </div>)
        })}
    </div>)
};

export default SubmissionResultsDetails;