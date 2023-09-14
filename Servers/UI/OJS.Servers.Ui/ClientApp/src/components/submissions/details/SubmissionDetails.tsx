import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import first from 'lodash/first';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { contestParticipationType } from '../../../common/contest-helpers';
import { IIndexContestsType } from '../../../common/types';
import { useHashUrlParams } from '../../../hooks/common/use-hash-url-params';
import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';
import { useAppUrls } from '../../../hooks/use-app-urls';
import { useAuth } from '../../../hooks/use-auth';
import { useContests } from '../../../hooks/use-contests';
import { usePageTitles } from '../../../hooks/use-page-titles';
import concatClassNames from '../../../utils/class-names';
import { preciseFormatDate } from '../../../utils/dates';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import CodeEditor from '../../code-editor/CodeEditor';
import AlertBox, { AlertBoxType } from '../../guidelines/alert-box/AlertBox';
import { Button, ButtonSize, ButtonState, ButtonType, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import IconSize from '../../guidelines/icons/common/icon-sizes';
import LeftArrowIcon from '../../guidelines/icons/LeftArrowIcon';
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
            currentSubmissionDetailsResults,
            validationErrors,
            downloadErrorMessage,
        },
        actions: {
            downloadProblemSubmissionFile,
            setDownloadErrorMessage,
            getSubmissionDetailsResults,
            setCurrentSubmission,
            selectSubmissionById,
        },
    } = useSubmissionsDetails();
    const { actions: { setPageTitle } } = usePageTitles();
    const { state: { user: { permissions: { canAccessAdministration } } } } = useAuth();
    const {
        state: { contest },
        actions: { loadContestByProblemId },
    } = useContests();

    const { getAdministrationRetestSubmissionInternalUrl, getParticipateInContestUrl } = useAppUrls();
    const { state: { user } } = useAuth();
    const { state: { hashParam } } = useHashUrlParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (isNil(currentSubmission)) {
            return;
        }

        const { problem: { id } } = currentSubmission;

        loadContestByProblemId(id);
    }, [ currentSubmission, loadContestByProblemId ]);

    const submissionTitle = useMemo(
        () => `Submission №${currentSubmission?.id}`,
        [ currentSubmission?.id ],
    );

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
            setPageTitle(submissionTitle);
        },
        [ setPageTitle, submissionTitle ],
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

    useEffect(
        () => {
            if (isNil(currentSubmission)) {
                return;
            }

            const { id: submissionId, isOfficial } = currentSubmission;

            (async () => {
                await getSubmissionDetailsResults(submissionId, isOfficial);
            })();
        },
        [ currentSubmission, getSubmissionDetailsResults ],
    );

    const handleReloadClick = useCallback(
        async () => {
            if (isNil(currentSubmission)) {
                return;
            }

            const { id: submissionId, isOfficial } = currentSubmission;

            await getSubmissionDetailsResults(submissionId, isOfficial);
        },
        [ currentSubmission, getSubmissionDetailsResults ],
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
        [ canAccessAdministration, getAdministrationRetestSubmissionInternalUrl ],
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
        !currentSubmission.processingComment
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
        () => isNil(contest)
            ? ButtonState.disabled
            : ButtonState.enabled,
        [ contest ],
    );

    const refreshableSubmissionsList = useCallback(
        () => (
            <div className={styles.navigation}>
                <div style={{ marginBottom: '24px' }}>
                    <Heading type={HeadingType.secondary}>Submissions</Heading>
                </div>
                <SubmissionsList
                  items={currentSubmissionDetailsResults}
                  selectedSubmission={currentSubmission}
                  className={styles.submissionsList}
                />
                { renderButtonsSection() }
                { renderSubmissionInfo() }
            </div>
        ),
        [ currentSubmissionDetailsResults, currentSubmission, renderButtonsSection, renderSubmissionInfo ],
    );

    const setSubmissionAndStartParticipation = useCallback(
        () => {
            const { id: contestId } = contest as IIndexContestsType;

            const participationType = contestParticipationType(currentSubmission!.isOfficial);

            navigate({
                pathname: getParticipateInContestUrl({ id: contestId, participationType }),
                hash: hashParam,
            });

            setCurrentSubmission(null);
            selectSubmissionById(null);
        },
        [ contest, currentSubmission, navigate, getParticipateInContestUrl, hashParam, setCurrentSubmission, selectSubmissionById ],
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
                          onClick={() => setSubmissionAndStartParticipation()}
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
