import React, { useCallback } from 'react';
import { isEmpty, isNil } from 'lodash';
import { Button, ButtonType } from '../../guidelines/buttons/Button';

import { useProblemSubmissions } from '../../../hooks/submissions/use-problem-submissions';

import styles from './SubmissionResults.module.scss';
import concatClassNames from '../../../utils/class-names';
import SubmissionsList from '../../submissions/submissions-list/SubmissionsList';

const ProblemSubmissions = () => {
    const {
        state: { submissions },
        actions: { getSubmissions },
    } = useProblemSubmissions();

    const reload = useCallback(
        async () => {
            await getSubmissions();
        },
        [ getSubmissions ],
    );

    const handleReloadClick = useCallback(async () => {
        await reload();
    }, [ reload ]);

    // const renderSubmission = (submission: ISubmissionDetails) => (
    //     <ProblemSubmission submission={submission} />
    // );

    const refreshButtonClass = 'refreshButton';
    const refreshButtonClassName = concatClassNames(styles.refreshBtn, refreshButtonClass);

    // const submissionResultsListItemClass = 'submission results';
    // const submissionResultsListItemClassName =
    // concatClassNames(styles.submissionItem, submissionResultsListItemClass);
    const submissionResultsContentClass = 'submissionResultsContent';
    const submissionResultsContentClassName = concatClassNames(styles.submissionResultsContent, submissionResultsContentClass);

    const renderSubmissions = () => {
        if (isNil(submissions) || isEmpty(submissions)) {
            return (
                <p> No results for this problem yet.</p>
            );
        }
        return (
        // <List
        //   values={submissions}
        //   itemFunc={renderSubmission}
        //   itemClassName={submissionResultsListItemClassName}
        //   fullWidth
        // />
            <SubmissionsList
              items={submissions}
              selectedSubmission={null}
            />
        );
    };

    return (
        <div className={submissionResultsContentClassName}>
            {renderSubmissions()}
            <Button
              type={ButtonType.secondary}
              className={refreshButtonClassName}
              onClick={() => handleReloadClick()}
              text="Refresh"
            />
        </div>
    );
};

export default ProblemSubmissions;
