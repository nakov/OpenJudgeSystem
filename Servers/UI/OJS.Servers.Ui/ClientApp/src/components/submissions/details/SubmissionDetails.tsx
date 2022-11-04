import React, { useEffect, useMemo } from 'react';
import isNil from 'lodash/isNil';

import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';
import concatClassNames from '../../../utils/class-names';
import CodeEditor from '../../code-editor/CodeEditor';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import SubmissionResults from '../submission-results/SubmissionResults';
import RefreshableSubmissionsList from '../submissions-list/RefreshableSubmissionsList';

import styles from './SubmissionDetails.module.scss';

const SubmissionDetails = () => {
    const {
        state: {
            currentSubmission,
            currentProblemSubmissionResults,
        },
        actions: { getSubmissionResults },
    } = useSubmissionsDetails();

    const problemNameHeadingText = useMemo(
        () => `${currentSubmission?.problem.name} - ${currentSubmission?.problem.id}`,
        [ currentSubmission?.problem.id, currentSubmission?.problem.name ],
    );

    const detailsHeadingText = useMemo(
        () => `Details #${currentSubmission?.id}`,
        [ currentSubmission?.id ],
    );

    const { submissionType } = currentSubmission || {};

    const submissionsNavigationClassName = 'submissionsNavigation';

    const submissionsDetails = 'submissionDetails';
    const submissionDetailsClassName = concatClassNames(styles.navigation, styles.submissionDetails, submissionsDetails);

    useEffect(() => {
        if (isNil(currentSubmission)) {
            return;
        }

        const { problem: { id: problemId }, isOfficial } = currentSubmission;

        (async () => {
            await getSubmissionResults(problemId, isOfficial);
        })();
    }, [ currentSubmission, getSubmissionResults ]);

    if (isNil(currentSubmission)) {
        return <div>No details fetched.</div>;
    }

    return (
        <div className={styles.detailsWrapper}>
            <div className={styles.navigation}>
                <div className={submissionsNavigationClassName}>
                    <Heading type={HeadingType.secondary}>Submissions</Heading>
                </div>
                <RefreshableSubmissionsList
                  items={currentProblemSubmissionResults}
                  selectedSubmission={currentSubmission}
                  className={styles.submissionsList}
                />
            </div>
            <div className={styles.code}>
                <Heading
                  type={HeadingType.secondary}
                  className={styles.taskHeading}
                >
                    {problemNameHeadingText}
                </Heading>
                <CodeEditor
                  readOnly
                  code={currentSubmission?.content}
                  selectedSubmissionType={submissionType}
                />
            </div>
            <div className={submissionDetailsClassName}>
                <Heading type={HeadingType.secondary}>{detailsHeadingText}</Heading>
                <SubmissionResults testRuns={currentSubmission.testRuns} />
            </div>
        </div>
    );
};

export default SubmissionDetails;
