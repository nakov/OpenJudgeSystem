import React from 'react';
import { BiInfoCircle, BiMemoryCard, BiTime } from 'react-icons/bi';

import { SubmissionResultType } from '../../../common/constants';
import { ITestRunDetailsType } from '../../../hooks/submissions/types';
import concatClassNames from '../../../utils/class-names';
import { toLowerCase } from '../../../utils/string-utils';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import IconSize from '../../guidelines/icons/common/icon-sizes';
import Icon from '../../guidelines/icons/Icon';

import styles from './TestRunDetails.module.scss';

interface ITestRunDetailsProps {
    testRun: ITestRunDetailsType;
}

const getResultIsWrongAnswerResultType = (run: ITestRunDetailsType) => toLowerCase(run.resultType) !== SubmissionResultType.CorrectAnswer;

const TestRunDetails = ({ testRun }: ITestRunDetailsProps) => {
    const testRunHeadingClassName = concatClassNames(
        styles.testRunHeading,
        getResultIsWrongAnswerResultType(testRun)
            ? styles.wrongTestRunHeading
            : styles.correctTestRunHeading,
    );

    const testRunHeadingText = () => {
        const testRunText = `Test #${testRun.orderBy}`;

        if (testRun.isTrialTest) {
            return `Zero ${testRunText}`;
        }

        return testRunText;
    };

    return (
        <div className={styles.testRun}>
            <div className={styles.testRunContainer}>
                <span className={styles.testRunData}>
                    <Heading type={HeadingType.small} className={testRunHeadingClassName}>
                        { testRunHeadingText() }
                    </Heading>
                    <span className={styles.testRunDataParagraph}>
                        <Icon Component={BiTime} size={IconSize.Large} className={styles.iconPassiveColor} />
                        <span style={{ marginTop: '5px' }}>
                            {testRun.timeUsed}
                            {' '}
                            s.
                        </span>
                    </span>
                    <span className={styles.testRunDataParagraph}>
                        <Icon Component={BiMemoryCard} size={IconSize.Large} className={styles.iconPassiveColor} />
                        <span style={{ marginTop: '5px' }}>
                            {testRun.memoryUsed}
                        </span>
                    </span>
                    <Icon Component={BiInfoCircle} size={IconSize.Large} className={styles.iconActiveColor} />
                </span>
            </div>
        </div>
    );
};

export default TestRunDetails;
