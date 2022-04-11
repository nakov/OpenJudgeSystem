import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';
import { Button } from '../../guidelines/buttons/Button';
import styles from './SubmissionResults.module.scss';
import List from '../../guidelines/lists/List';
import { ISubmissionResultType } from '../../../hooks/submissions/types';
import ProblemSubmission from '../problem-submission/ProblemSubmission';

interface ISubmissionResultsProps {
    problemId?: number,
}

const ProblemSubmissions = ({ problemId }: ISubmissionResultsProps) => {
    const {
        currentProblemSubmissionResults,
        getSubmissionResults,
    } = useSubmissionsDetails();

    const getResults = useCallback(async () => {
        if (problemId != null) {
            await getSubmissionResults(problemId);
        }
    }, [ getSubmissionResults, problemId ]);

    const reload = useCallback(async () => {
        await getResults();
    }, [ getResults ]);

    useEffect(() => {
        if (currentProblemSubmissionResults.length !== 0) {
            return;
        }
        (async () => {
            await reload();
        })();
    }, [ currentProblemSubmissionResults, getResults, reload ]);

    const renderSubmission = (submission: ISubmissionResultType) => (
        <ProblemSubmission submission={submission} />
    );

    const renderSubmissions = () => {
        if (currentProblemSubmissionResults.length === 0) {
            return (
                <p> No results for this problem yet.</p>
            );
        }
        return (
            <List
              values={currentProblemSubmissionResults}
              itemFunc={renderSubmission}
              itemClassName={styles.submissionItem}
              fullWidth
            />
        );
    };

    return (
        <div className={styles.submissionResultsContent}>
            {renderSubmissions()}
            <Button type="secondary" className={styles.refreshBtn} onClick={reload} text="Refresh" />
        </div>
    );
};

export default ProblemSubmissions;
