import * as React from 'react';
import { useCallback } from 'react';
import Heading from '../../guidelines/headings/Heading';
import Diff from '../../Diff';
import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';
import { ITestRunDetailsType } from '../../../hooks/submissions/types';
import styles from './SubmissionResults.module.scss';

const SubmissionResults = () => {
    const { currentSubmission } = useSubmissionsDetails();

    const getTestRunHeading = (run: ITestRunDetailsType, runIndex: number) => `Test #${runIndex} (${run.resultType}) `;

    const getIsCorrectAnswerResultType = (run: ITestRunDetailsType) => run.resultType === 'CorrectAnswer';

    const getTestRunHeadingClassName = useCallback(
        (run: ITestRunDetailsType) => (getIsCorrectAnswerResultType(run)
            ? styles.correctTestRunHeading
            : styles.wrongTestRunHeading),
        [],
    );

    const renderTimeAndMemoryUsed = (run: ITestRunDetailsType) => (
        <>
            <p>
                Time used:
                {run.maxUsedTime}
                s
            </p>
            <p>
                Memory used:
                {run.maxUsedMemory}
                {' '}
                MB
            </p>
        </>
    );

    const renderTrialTests = useCallback((trialTests: ITestRunDetailsType[]) => trialTests.map((run, index) => (
        <div className={styles.submissionResultContainer}>
            <Heading type="secondary" className={(() => getTestRunHeadingClassName(run))()}>
                {`Zero ${getTestRunHeading(run, index)}`}
            </Heading>
            {
                run.isTrialTest && (run.expectedOutputFragment !== null && run.userOutputFragment !== null)
                    ? <Diff expectedStr={run.expectedOutputFragment} actualStr={run.userOutputFragment} />
                    : null
            }
            {renderTimeAndMemoryUsed(run)}
        </div>
    )), [ getTestRunHeadingClassName ]);

    const renderCompeteTests = useCallback((competeTests: ITestRunDetailsType[]) => competeTests.map((run, index) => (
        <div className={styles.submissionResultContainer}>
            <Heading type="secondary" className={(() => getTestRunHeadingClassName(run))()}>
                {getTestRunHeading(run, index)}
            </Heading>
            {renderTimeAndMemoryUsed(run)}
        </div>
    )), [ getTestRunHeadingClassName ]);

    const renderTestRuns = useCallback(
        () => {
            if (currentSubmission == null) {
                return null;
            }
            return (
                <>
                    {renderTrialTests(currentSubmission!.testRuns.filter((tr) => tr.isTrialTest))}
                    {renderCompeteTests(currentSubmission!.testRuns.filter((tr) => !tr.isTrialTest))}
                </>
            );
        },
        [ currentSubmission, renderCompeteTests, renderTrialTests ],
    );

    return (
        <>
            {renderTestRuns()}
        </>
    );
};

export default SubmissionResults;
