import React from 'react';
import Icon from '../../../guidelines/icons/Icon';

import { BiCaretDown } from "react-icons/bi";
import IconSize from "../../../guidelines/icons/common/icon-sizes";

import styles from '../SubmissionDetails.module.scss';
interface ISubmissionResultsDetails {
    testRuns?: any[]
}
const SubmissionResultsDetails = ({ testRuns }: ISubmissionResultsDetails) => {
    console.log('test runs => ', testRuns);
    const renderTestHeading = (testRun: any) => {
        const isWrongAnswer = testRun.resultType === 'WrongAnswer';
        let testRunText = `Test #${testRun.orderBy}`;
        if (testRun.isTrialTest) {
            testRunText = `Zero ${testRunText}`;
        }
        
        isWrongAnswer ? testRunText += ' (Incorrect Answer)' : testRunText += ' (Correct Answer)'

        return (<h2 style={{fontSize: 30, margin: '10px 0',color: isWrongAnswer ? '#fc4c50' : 'green'}}>
            {testRunText}
        </h2>);
    };
    
    const renderShowInputButton = () => {
        return(<div className={styles.showInputButton}>
            <span>SHOW INPUT</span>
            <Icon Component={BiCaretDown} size={IconSize.Large} className={styles.iconActiveColor} />
        </div>)
    };
    
    const renderTrialTestData = () => {
        return(<>
            <div className={styles.zeroTestDescription}>The zero tests are not included in the final result.</div>
            {renderShowInputButton()}
            <div className={styles.zeroTestDataWrapper}>
                <div className={styles.outputDiff}>
                    <span>Expected output:</span>
                </div>
                <div className={styles.outputDiff}>
                    <span>Received output:</span>
                </div>
            </div>
        </>);
    }
    
    return(<div className={styles.submissionResultDetailsWrapper}>
        {testRuns?.map((test: any) => {
            return(<div key={`test-run-details-${test.id}`} className={styles.submissionResultDetails}>
                {renderTestHeading(test)}
                {test.isTrialTest && renderTrialTestData()}
            </div>)
        })}
    </div>)
};

export default SubmissionResultsDetails;