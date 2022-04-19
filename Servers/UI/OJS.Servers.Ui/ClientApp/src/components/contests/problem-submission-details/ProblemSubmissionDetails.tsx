import React from 'react';
import { ISubmissionDetails, ITestRunDetailsType } from '../../../hooks/submissions/types';
import List from '../../guidelines/lists/List';
import TickIcon from '../../guidelines/icons/TickIcon';

import styles from './ProblemSubmissionDetails.module.scss';
import { Button } from '../../guidelines/buttons/Button';
import concatClassNames from '../../../utils/class-names';
import ErrorIcon from '../../guidelines/icons/ErrorIcon';

interface IProblemSubmissionDetailsProps {
    submission: ISubmissionDetails
}

interface IProblemSubmissionProps {
    testRun: ITestRunDetailsType;
    onSelect: () => void;
}

const TestRun = ({
    testRun,
    onSelect,
}: IProblemSubmissionProps) => {
    const {
        resultType,
        maxUsedTime,
        maxUsedMemory,
        isTrialTest,
    } = testRun;

    const helperText = `Memory: ${maxUsedMemory}, Time: ${maxUsedTime}`;

    const IconComponent = resultType.toLowerCase() === 'correctanswer'
        ? TickIcon
        : ErrorIcon;

    const disabledClassName = isTrialTest
        ? ''
        : styles.disabled;

    return (
        <Button
          type="plain"
          onClick={() => onSelect()}
          className={concatClassNames(styles.btnTestRun, disabledClassName)}
        >
            <IconComponent
              helperText={helperText}
            />
        </Button>
    );
};

const ProblemSubmissionDetails = ({ submission }: IProblemSubmissionDetailsProps) => {
    const { testRuns } = submission;
    const handleTestRunClick = (testRun: ITestRunDetailsType) => {
        const { isTrialTest } = testRun;
        if (!isTrialTest) {
            return;
        }
        alert(JSON.stringify(testRun));
    };

    const renderTestRun = (testRun: ITestRunDetailsType) => (
        <TestRun testRun={testRun} onSelect={() => handleTestRunClick(testRun)} />
    );
    return (
        <>
            <List
              values={testRuns}
              itemFunc={renderTestRun}
              orientation="horizontal"
              itemClassName={styles.testRunItem}
            />
        </>
    );
};
export default ProblemSubmissionDetails;
