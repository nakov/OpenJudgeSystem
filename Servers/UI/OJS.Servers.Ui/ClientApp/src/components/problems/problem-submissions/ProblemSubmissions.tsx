import React, { useCallback } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { useProblemSubmissions } from '../../../hooks/submissions/use-problem-submissions';
import { useCurrentContest } from '../../../hooks/use-current-contest';
import { usePages } from '../../../hooks/use-pages';
import { useProblems } from '../../../hooks/use-problems';
import concatClassNames from '../../../utils/class-names';
import { Button, ButtonType } from '../../guidelines/buttons/Button';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import PaginationControls from '../../guidelines/pagination/PaginationControls';
import SubmissionsList from '../../submissions/submissions-list/SubmissionsList';

import styles from './ProblemSubmissions.module.scss';

const ProblemSubmissions = () => {
    const {
        state: {
            submissions,
            problemSubmissionsPage,
            problemSubmissionsError,
        },
        actions: {
            loadSubmissions,
            changeProblemSubmissionsPage,
        },
    } = useProblemSubmissions();

    const { actions: { loadParticipantScores } } = useCurrentContest();
    const { state: { currentProblem } } = useProblems();
    const { state: { pagesInfo } } = usePages();

    const reload = useCallback(
        async () => {
            if (!isNil(currentProblem)) {
                const { id } = currentProblem;
                loadSubmissions(id, problemSubmissionsPage);
                loadParticipantScores();
            }
        },
        [ loadParticipantScores, loadSubmissions, currentProblem, problemSubmissionsPage ],
    );

    const handleRefreshClick = useCallback(
        async () => {
            await reload();
        },
        [ reload ],
    );

    const handlePageChange = useCallback(
        (page: number) => {
            changeProblemSubmissionsPage(page);
        },
        [ changeProblemSubmissionsPage ],
    );

    const refreshButtonClass = 'refreshButton';
    const refreshButtonClassName = concatClassNames(styles.refreshBtn, refreshButtonClass);

    // const submissionResultsListItemClass = 'submission results';
    // const submissionResultsListItemClassName =
    // concatClassNames(styles.submissionItem, submissionResultsListItemClass);
    const submissionResultsContentClass = 'submissionResultsContent';
    const submissionResultsContentClassName = concatClassNames(styles.submissionResultsContent, submissionResultsContentClass);

    const renderErrorMessage = useCallback(
        () => {
            if (!isNil(problemSubmissionsError)) {
                const { detail } = problemSubmissionsError;

                return (
                    <p
                      className={styles.problemSubmissionsError}
                    >
                        {detail}
                    </p>
                );
            }

            return null;
        },
        [ problemSubmissionsError ],
    );

    const renderSubmissions = useCallback(
        () => {
            if (isNil(submissions) || isEmpty(submissions)) {
                return (
                    <p> No results for this problem yet.</p>
                );
            }

            const { pagesCount } = pagesInfo;

            return (
                <>
                    <SubmissionsList
                      items={submissions}
                      selectedSubmission={null}
                      className={styles.submissionsList}
                    />
                    <PaginationControls
                      count={pagesCount}
                      page={problemSubmissionsPage}
                      onChange={handlePageChange}
                    />
                </>
            );
        },
        [ problemSubmissionsPage, handlePageChange, pagesInfo, submissions ],
    );

    const renderProblemSubmissions = useCallback(
        () => (
            <>
                <Heading type={HeadingType.secondary}>
                    Submissions
                </Heading>
                <div className={submissionResultsContentClassName}>
                    {renderSubmissions()}
                    <Button
                      type={ButtonType.secondary}
                      className={refreshButtonClassName}
                      onClick={() => handleRefreshClick()}
                      text="Refresh"
                    />
                </div>
            </>
        ),
        [ handleRefreshClick, refreshButtonClassName, renderSubmissions, submissionResultsContentClassName ],
    );

    const renderPage = useCallback(
        () => isNil(problemSubmissionsError)
            ? renderProblemSubmissions()
            : renderErrorMessage(),
        [ problemSubmissionsError, renderProblemSubmissions, renderErrorMessage ],
    );

    return renderPage();
};

export default ProblemSubmissions;
