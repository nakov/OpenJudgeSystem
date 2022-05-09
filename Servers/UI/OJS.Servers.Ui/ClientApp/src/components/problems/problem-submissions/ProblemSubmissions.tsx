import React, { useCallback } from 'react';
import { Button } from '../../guidelines/buttons/Button';
import List from '../../guidelines/lists/List';

import { ISubmissionDetails } from '../../../hooks/submissions/types';

import { useProblemSubmissions } from '../../../hooks/submissions/use-problem-submissions';

import ProblemSubmission from '../problem-submission/ProblemSubmission';

import styles from './SubmissionResults.module.scss';
import concatClassNames from '../../../utils/class-names';

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

    const renderSubmission = (submission: ISubmissionDetails) => (
        <ProblemSubmission submission={submission} />
    );
    const refreshButtonClass = 'refreshButton';
    const refreshButtonClassName = concatClassNames(styles.refreshBtn, refreshButtonClass);
    const renderSubmissions = () => {
        if (!submissions || submissions.length === 0) {
            return (
                <p> No results for this problem yet.</p>
            );
        }
        return (
            <List
              values={submissions}
              itemFunc={renderSubmission}
              itemClassName={styles.submissionItem}
              fullWidth
            />
        );
    };

    return (
        <div className={styles.submissionResultsContent}>
            {renderSubmissions()}
            <Button
              type="secondary"
              className={refreshButtonClassName}
              onClick={() => handleReloadClick()}
              text="Refresh"
            />
        </div>
    );
};

export default ProblemSubmissions;
