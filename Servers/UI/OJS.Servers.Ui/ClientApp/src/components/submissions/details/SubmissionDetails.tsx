import React, { useCallback, useEffect, useMemo } from 'react';
import first from 'lodash/first';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { contestParticipationType } from '../../../common/contest-helpers';
import { useProblemSubmissions } from '../../../hooks/submissions/use-problem-submissions';
import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';
import { useAuth } from '../../../hooks/use-auth';
import { usePageTitles } from '../../../hooks/use-page-titles';
import { usePages } from '../../../hooks/use-pages';
import { useProblems } from '../../../hooks/use-problems';
import concatClassNames from '../../../utils/class-names';
import { preciseFormatDate } from '../../../utils/dates';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import { getAdministrationRetestSubmissionInternalUrl, getParticipateInContestUrl } from '../../../utils/urls';
import CodeEditor from '../../code-editor/CodeEditor';
import AlertBox, { AlertBoxType } from '../../guidelines/alert-box/AlertBox';
import { Button, ButtonSize, ButtonState, ButtonType, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import IconSize from '../../guidelines/icons/common/icon-sizes';
import LeftArrowIcon from '../../guidelines/icons/LeftArrowIcon';
import PaginationControls from '../../guidelines/pagination/PaginationControls';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';
import SubmissionResults from '../submission-results/SubmissionResults';
import SubmissionsList from '../submissions-list/SubmissionsList';

import SubmissionResultsDetails from './submission-result-details/SubmissionResultsDetails';

import styles from './SubmissionDetails.module.scss';

const SubmissionDetails = () => {
    const {
        state: {
            isLoading,
            currentSubmission,
            currentSubmissionResults,
            validationErrors,
            downloadErrorMessage,
        },
        actions: {
            getResults,
            downloadProblemSubmissionFile,
            setDownloadErrorMessage,
            setCurrentSubmission,
            selectSubmissionById,
            setSubmissionResultsUrlParams,
            getDetails,
        },
    } = useSubmissionsDetails();
    const {
        state: { problemSubmissionsPage },
        actions: { changeProblemSubmissionsPage },
    } = useProblemSubmissions();
    const { actions: { initiateRedirectionToProblem } } = useProblems();
    const { actions: { setPageTitle } } = usePageTitles();
    const { state: { user: { permissions: { canAccessAdministration } } } } = useAuth();

    const { state: { user } } = useAuth();
    const { state: { pagesInfo } } = usePages();

    const renderDownloadErrorMessage = useCallback(() => {
        if (isNil(downloadErrorMessage)) {
            return null;
        }

        return (
            <AlertBox
              message={downloadErrorMessage}
              type={AlertBoxType.error}
              onClose={() => setDownloadErrorMessage(null)}
            />
        );
    }, [ downloadErrorMessage, setDownloadErrorMessage ]);

    const handleDownloadSubmissionFile = useCallback(
        async () => {
            if (isNil(currentSubmission)) {
                return;
            }

            const { id } = currentSubmission;
            await downloadProblemSubmissionFile(id);
        },
        [ downloadProblemSubmissionFile, currentSubmission ],
    );

    const renderResourceLink = useCallback(
        () => {
            if (isNil(currentSubmission)) {
                return null;
            }

            const { submissionType: { allowBinaryFilesUpload }, user: { userName: submissionUserName } } = currentSubmission;
            const { username: loggedInUserName } = user;
            if ((!canAccessAdministration && submissionUserName !== loggedInUserName) || !allowBinaryFilesUpload) {
                return null;
            }

            return (
                <div className={styles.resourceWrapper}>
                    <Button
                      type={ButtonType.primary}
                      className={styles.resourceLinkButton}
                      onClick={() => handleDownloadSubmissionFile()}
                    >
                        Download file
                    </Button>
                </div>
            );
        },
        [ handleDownloadSubmissionFile, canAccessAdministration, currentSubmission, user ],
    );

    useEffect(
        () => {
            if (currentSubmission) {
                setPageTitle(`Submission №${currentSubmission.id}`);
            }
        },
        [ currentSubmission, setPageTitle ],
    );

    const problemNameHeadingText = useMemo(
        () => {
            if (!currentSubmission) {
                return '';
            }

            return `${currentSubmission?.problem.name} - ${currentSubmission?.problem.id}`;
        },
        [ currentSubmission ],
    );

    const detailsHeadingText = useMemo(
        () => (
            <div style={{ marginBottom: '24px' }}>
                Details #
                {currentSubmission?.id}
            </div>
        ),
        [ currentSubmission?.id ],
    );

    const { submissionType } = currentSubmission || {};

    const submissionsDetails = 'submissionDetails';
    const submissionDetailsClassName = concatClassNames(
        styles.navigation,
        styles.submissionDetails,
        submissionsDetails,
    );

    const handleReloadClick = useCallback(
        async () => {
            if (isNil(currentSubmission)) {
                return;
            }

            const { id: submissionId } = currentSubmission;

            setSubmissionResultsUrlParams({
                submissionId,
                page: problemSubmissionsPage,
            });

            getDetails(submissionId);
        },
        [ problemSubmissionsPage, currentSubmission, setSubmissionResultsUrlParams, getDetails ],
    );

    const handlePageChange = useCallback(
        (page: number) => {
            changeProblemSubmissionsPage(page);

            const { id } = currentSubmission!;

            getResults(id, page);
        },
        [ changeProblemSubmissionsPage, currentSubmission, getResults ],
    );

    const renderRetestButton = useCallback(
        () => {
            if (!canAccessAdministration) {
                return null;
            }

            return (
                <LinkButton
                  type={LinkButtonType.secondary}
                  size={ButtonSize.medium}
                  to={getAdministrationRetestSubmissionInternalUrl()}
                  text="Retest"
                  className={styles.retestButton}
                />
            );
        },
        [ canAccessAdministration ],
    );
    const renderButtonsSection = useCallback(() => (
        <div className={styles.buttonsSection}>
            <Button
              onClick={handleReloadClick}
              text="Reload"
              type={ButtonType.secondary}
              className={styles.submissionReloadBtn}
            />
            {renderRetestButton()}
        </div>
    ), [ handleReloadClick, renderRetestButton ]);

    const renderTestsChangeMessage = useCallback(() => (
        currentSubmission?.testRuns.length === 0 &&
        currentSubmission.isCompiledSuccessfully &&
        currentSubmission.totalTests > 0 &&
        !currentSubmission.processingComment &&
        currentSubmission.isProcessed
            ? (
                <div className={styles.testChangesWrapper}>
                    <p>
                        The input/output data changed. Your (
                        {currentSubmission.points}
                        /
                        {currentSubmission.problem.maximumPoints}
                        )
                        submission is now outdated.
                        Click &quot;Retest&quot; to resubmit your solution for re-evaluation against the new test cases.
                        Your score may change.
                    </p>
                    {renderRetestButton()}
                </div>
            )
            : ''
    ), [ currentSubmission, renderRetestButton ]);

    const renderSubmissionInfo = useCallback(
        () => {
            if (!canAccessAdministration || isNil(currentSubmission)) {
                return null;
            }

            const { createdOn, modifiedOn, startedExecutionOn, completedExecutionOn, user: { userName } } = currentSubmission;

            return (
                <div className={styles.submissionInfo}>
                    <p className={styles.submissionInfoParagraph}>
                        Created on:
                        {' '}
                        {preciseFormatDate(createdOn)}
                    </p>
                    <p className={styles.submissionInfoParagraph}>
                        Modified on:
                        {' '}
                        {isNil(modifiedOn)
                            ? 'never'
                            : preciseFormatDate(modifiedOn)}
                    </p>
                    <p className={styles.submissionInfoParagraph}>
                        Started execution on:
                        {' '}
                        {isNil(startedExecutionOn)
                            ? 'never'
                            : preciseFormatDate(startedExecutionOn)}
                    </p>
                    <p className={styles.submissionInfoParagraph}>
                        Completed execution on:
                        {' '}
                        {isNil(completedExecutionOn)
                            ? 'never'
                            : preciseFormatDate(completedExecutionOn)}
                    </p>
                    <p className={styles.submissionInfoParagraph}>
                        Username:
                        {' '}
                        {userName}
                    </p>
                </div>
            );
        },
        [ currentSubmission, canAccessAdministration ],
    );

    const backButtonState = useMemo(
        () => isNil(currentSubmission?.contestId)
            ? ButtonState.disabled
            : ButtonState.enabled,
        [ currentSubmission ],
    );

    const { pagesCount } = pagesInfo;
    const refreshableSubmissionsList = useCallback(
        () => (
            <div className={styles.navigation}>
                <div style={{ marginBottom: '24px' }}>
                    <Heading type={HeadingType.secondary}>Submissions</Heading>
                </div>
                <SubmissionsList
                  items={currentSubmissionResults}
                  selectedSubmission={currentSubmission}
                  className={styles.submissionsList}
                />
                <PaginationControls
                  count={pagesCount}
                  page={problemSubmissionsPage}
                  onChange={handlePageChange}
                />
                { renderButtonsSection() }
                { renderSubmissionInfo() }
            </div>
        ),
        [ currentSubmissionResults, currentSubmission, pagesCount,
            problemSubmissionsPage, handlePageChange, renderButtonsSection, renderSubmissionInfo ],
    );

    const setSubmissionAndStartParticipation = useCallback(
        (contestId: number) => {
            const participationType = contestParticipationType(currentSubmission!.isOfficial);

            const participateInContestUrl = getParticipateInContestUrl({
                id: contestId,
                participationType,
            });

            const { problem: { id: problemId } } = currentSubmission!;

            initiateRedirectionToProblem(problemId, participateInContestUrl);

            setCurrentSubmission(null);
            selectSubmissionById(null);
        },
        [ currentSubmission, selectSubmissionById, setCurrentSubmission, initiateRedirectionToProblem ],
    );

    const codeEditor = useCallback(
        () => (
            <div className={styles.code}>
                <Heading
                  type={HeadingType.secondary}
                  className={styles.taskHeading}
                  style={!isNil(problemNameHeadingText) && problemNameHeadingText.length >= 30
                      ? { marginBottom: 0 }
                      : { marginBottom: '24px' }}
                >
                    <div className={styles.btnContainer}>
                        <LeftArrowIcon className={styles.leftArrow} size={IconSize.Large} />
                        <Button
                          type={ButtonType.secondary}
                          size={ButtonSize.small}
                          onClick={() => setSubmissionAndStartParticipation(currentSubmission!.contestId)}
                          className={styles.backBtn}
                          text=" "
                          state={backButtonState}
                        />
                    </div>
                    <div style={{ maxWidth: '30ch', textAlign: 'center' }}>
                        {problemNameHeadingText}
                    </div>
                </Heading>
                <div>
                    {renderTestsChangeMessage()}
                </div>
                {
                        !currentSubmission?.isProcessed
                            ? (
                                <AlertBox
                                  className={styles.alertBox}
                                  message="The submission is in queue and will be processed shortly. Please wait."
                                  type={AlertBoxType.info}
                                  isClosable={false}
                                />
                            )
                            : null
                    }
                {submissionType?.allowBinaryFilesUpload
                    ? (
                        <div className={styles.resourceWrapper}>
                            {renderResourceLink()}
                            {renderDownloadErrorMessage()}
                        </div>
                    )
                    : (
                        <CodeEditor
                          readOnly
                          code={currentSubmission?.content}
                          selectedSubmissionType={submissionType}
                        />
                    )}
            </div>
        ),
        [
            problemNameHeadingText,
            submissionType,
            backButtonState,
            renderResourceLink,
            renderDownloadErrorMessage,
            currentSubmission,
            setSubmissionAndStartParticipation,
            renderTestsChangeMessage,
        ],
    );

    const submissionResults = useCallback(
        () => (isLoading
            ? (
                <div style={{ ...flexCenterObjectStyles }}>
                    <SpinningLoader />
                </div>
            )
            : (
                <div className={submissionDetailsClassName}>
                    <Heading type={HeadingType.secondary}>{detailsHeadingText}</Heading>
                    {isNil(currentSubmission)
                        ? ''
                        : (
                            <SubmissionResults
                              testRuns={currentSubmission.testRuns}
                              compilerComment={currentSubmission?.compilerComment}
                              isCompiledSuccessfully={currentSubmission?.isCompiledSuccessfully}
                            />
                        )}
                </div>
            )),
        [ currentSubmission, detailsHeadingText, submissionDetailsClassName, isLoading ],
    );

    const renderErrorMessage = useCallback(
        () => {
            const error = first(validationErrors);
            if (!isNil(error)) {
                const { detail } = error;
                return (
                    <div className={styles.headingContest}>
                        <Heading type={HeadingType.primary} className={styles.contestHeading}>
                            {detail}
                        </Heading>
                    </div>
                );
            }

            return null;
        },
        [ validationErrors ],
    );

    if (!isLoading && isNil(currentSubmission) && isEmpty(validationErrors)) {
        return <div>No details fetched.</div>;
    }

    if (!isEmpty(validationErrors)) {
        return renderErrorMessage();
    }

    if (isLoading) {
        return (
            <div style={{ ...flexCenterObjectStyles }}>
                <SpinningLoader />
            </div>
        );
    }

    return (
        <>
            <div className={styles.detailsWrapper}>
                {refreshableSubmissionsList()}
                {codeEditor()}
                {submissionResults()}
            </div>
            <SubmissionResultsDetails testRuns={currentSubmission?.testRuns} />
        </>
    );
};

export default SubmissionDetails;
