import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { isNil } from 'lodash';
import styles from './SubmissionDetails.module.scss';
import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import CodeEditor from '../../code-editor/CodeEditor';
import { ISubmissionDetails } from '../../../hooks/submissions/types';
import List, { ListType, Orientation } from '../../guidelines/lists/List';

const SubmissionDetails = () => {
    const {
        currentSubmission,
        currentProblemSubmissionResults,
        getSubmissionResults,
    } = useSubmissionsDetails();
    const { content: submissionCode } = currentSubmission || '';

    const problemNameHeadingText = useMemo(() => `Problem ${currentSubmission?.problem.name}`, [ currentSubmission?.problem.name ]);

    const detailsHeadingText = useMemo(() => `Details #${currentSubmission?.id}`, [ currentSubmission?.id ]);

    useEffect(() => {
        if (isNil(currentSubmission)) {
            return;
        }

        (async () => {
            await getSubmissionResults(currentSubmission.problem.id);
        })();
    }, [ currentSubmission, getSubmissionResults ]);

    const renderSubmissionListItem = (submissionDetails: ISubmissionDetails) => (
        <p>
            #
            {submissionDetails.id}
            {submissionDetails.submissionType}
            ,
            {' '}
            {submissionDetails.points}
            /
            {submissionDetails.maximumPoints}
        </p>
    );

    const renderSubmissionsForProblem =
        () => (
            <List
              className={styles.submissionListItem}
              itemClassName={styles.submissionListItem}
              values={currentProblemSubmissionResults}
              itemFunc={renderSubmissionListItem}
              type={ListType.normal}
              orientation={Orientation.vertical}
            />
        );

    const render = () => {
        if (isNil(currentSubmission)) {
            return (
                <>No details fetched.</>
            );
        }

        return (
            <>
                <div className={styles.detailsWrapper}>
                    <div className={styles.code}>
                        <Heading type={HeadingType.secondary}>{problemNameHeadingText}</Heading>
                        <CodeEditor
                          readOnly
                          submissionCode={submissionCode}
                        />
                    </div>
                    <div className={styles.submissionsNavigation}>
                        <Heading type={HeadingType.secondary}>Submissions</Heading>
                        {renderSubmissionsForProblem()}
                    </div>
                    <div className={styles.submissionDetails}>
                        <Heading type={HeadingType.secondary}>{detailsHeadingText}</Heading>
                        <p>Details go here</p>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div>
            {render()}
        </div>
    );
};

export default SubmissionDetails;
