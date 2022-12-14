import React, { useEffect, useMemo } from 'react';
import isNil from 'lodash/isNil';

import { ContestParticipationType } from '../../../common/constants';
import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';
import { useAppUrls } from '../../../hooks/use-app-urls';
import { useContests } from '../../../hooks/use-contests';
import { usePageTitles } from '../../../hooks/use-page-titles';
import concatClassNames from '../../../utils/class-names';
import CodeEditor from '../../code-editor/CodeEditor';
import { ButtonSize, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';
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
    const { actions: { setPageTitle } } = usePageTitles();
    const { getAdministrationRetestSubmissionInternalUrl } = useAppUrls();
    const {
        state: { contest },
        actions: { getContestByProblemId },
    } = useContests();

    const { getRegisterContestTypeUrl } = useAppUrls();

    useEffect(() => {
        const reload = sessionStorage.getItem('reload');
        if (isNil(reload)) {
            sessionStorage.reload = true;
            window.location.reload();
        } else {
            sessionStorage.removeItem('reload');
        }
    }, []);

    useEffect(() => {
        if (isNil(currentSubmission)) {
            return;
        }

        getContestByProblemId(currentSubmission.problem.id);
    }, [ currentSubmission, getContestByProblemId ]);

    const submissionTitle = useMemo(
        () => `Submission №${currentSubmission?.id}`,
        [ currentSubmission?.id ],
    );

    const participationType = useMemo(
        () => contest.canBeCompeted
            ? ContestParticipationType.Compete
            : ContestParticipationType.Practice,
        [ contest ],
    );

    useEffect(() => {
        setPageTitle(submissionTitle);
    }, [ setPageTitle, submissionTitle ]);

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

        const { problem: { id: problemId }, isOfficial, user: { id: userId } } = currentSubmission;

        (async () => {
            await getSubmissionResults(problemId, isOfficial, userId);
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
                <LinkButton
                  type={LinkButtonType.secondary}
                  size={ButtonSize.medium}
                  to={getAdministrationRetestSubmissionInternalUrl()}
                  text="Retest"
                  className={styles.retestButton}
                />
            </div>
            <div className={styles.code}>
                <Heading
                  type={HeadingType.secondary}
                  className={styles.taskHeading}
                >
                    <span className={styles.lessThan}>
                        &lt;
                    </span>
                    <LinkButton
                      type={LinkButtonType.secondary}
                      size={ButtonSize.small}
                      to={getRegisterContestTypeUrl({ id: contest.id, participationType })}
                      className={styles.backBtn}
                      text="Back To Contest"
                    />
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
                <SubmissionResults
                  testRuns={currentSubmission.testRuns}
                  compilerComment={currentSubmission?.compilerComment}
                  isCompiledSuccessfully={currentSubmission?.isCompiledSuccessfully}
                />
            </div>
        </div>
    );
};

export default SubmissionDetails;
