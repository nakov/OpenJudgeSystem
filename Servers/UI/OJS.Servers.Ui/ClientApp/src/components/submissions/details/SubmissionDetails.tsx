import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { isNil } from 'lodash';
import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import CodeEditor from '../../code-editor/CodeEditor';
import SubmissionResults from '../submission-results/SubmissionResults';
import styles from './SubmissionDetails.module.scss';
import SubmissionsList from '../submissions-list/SubmissionsList';
import concatClassNames from '../../../utils/class-names';

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

    const submissionDetailsClass = 'submissionDetails';
    const submissionDetailsClassName = concatClassNames(styles.navigation, submissionDetailsClass);

    useEffect(() => {
        if (isNil(currentSubmission)) {
            return;
        }

        (async () => {
            await getSubmissionResults(currentSubmission.problem.id);
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
                <SubmissionsList
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
