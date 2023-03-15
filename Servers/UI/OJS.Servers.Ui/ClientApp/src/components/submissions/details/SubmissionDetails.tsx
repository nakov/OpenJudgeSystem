import React, { useCallback, useEffect, useMemo } from 'react';
import first from 'lodash/first';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IRegisterForContestTypeUrlParams } from '../../../common/app-url-types';
import { ContestParticipationType } from '../../../common/constants';
import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';
import { useAppUrls } from '../../../hooks/use-app-urls';
import { useAuth } from '../../../hooks/use-auth';
import { useContests } from '../../../hooks/use-contests';
import { usePageTitles } from '../../../hooks/use-page-titles';
import concatClassNames from '../../../utils/class-names';
import { preciseFormatDate } from '../../../utils/dates';
import CodeEditor from '../../code-editor/CodeEditor';
import Button, { ButtonSize, ButtonState, ButtonType, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import IconSize from '../../guidelines/icons/common/icon-sizes';
import LeftArrowIcon from '../../guidelines/icons/LeftArrowIcon';
import SubmissionResults from '../submission-results/SubmissionResults';
import RefreshableSubmissionsList from '../submissions-list/RefreshableSubmissionsList';

import styles from './SubmissionDetails.module.scss';

const SubmissionDetails = () => {
    const {
        state: {
            currentSubmission,
            currentProblemSubmissionResults,
            validationErrors,
        },
        actions: { getSubmissionResults },
    } = useSubmissionsDetails();
    const { actions: { setPageTitle } } = usePageTitles();
    const { state: { user: { permissions: { canAccessAdministration } } } } = useAuth();
    const { getAdministrationRetestSubmissionInternalUrl } = useAppUrls();

    const {
        state: { contest },
        actions: { loadContestByProblemId },
    } = useContests();

    const { getRegisterContestTypeUrl } = useAppUrls();

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

    const canBeCompeted = useMemo(
        () => contest?.canBeCompeted,
        [ contest ],
    );

    const participationType = useMemo(
        () => canBeCompeted
            ? ContestParticipationType.Compete
            : ContestParticipationType.Practice,
        [ canBeCompeted ],
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

    const registerContestTypeUrl = useMemo(
        () => getRegisterContestTypeUrl({ id: contest?.id, participationType } as IRegisterForContestTypeUrlParams),
        [ contest?.id, participationType, getRegisterContestTypeUrl ],
    );

    const { submissionType } = currentSubmission || {};

    const submissionsNavigationClassName = 'submissionsNavigation';

    const submissionsDetails = 'submissionDetails';
    const submissionDetailsClassName = concatClassNames(
        styles.navigation,
        styles.submissionDetails,
        submissionsDetails,
    );

    useEffect(() => {
        if (isNil(currentSubmission)) {
            return;
        }

        const { problem: { id: problemId }, isOfficial } = currentSubmission;

        (async () => {
            await getSubmissionResults(problemId, isOfficial);
        })();
    }, [ currentSubmission, getSubmissionResults ]);

    const submissionsReloadBtnClassName = 'submissionReloadBtn';

    const handleReloadClick = useCallback(async () => {
        if (isNil(currentSubmission)) {
            return;
        }

        const { problem: { id: problemId }, isOfficial } = currentSubmission;

        await getSubmissionResults(problemId, isOfficial);
    }, [ currentSubmission, getSubmissionResults ]);

    const renderReloadButton = useCallback(
        () => (
            <Button
              onClick={handleReloadClick}
              text="Reload"
              type={ButtonType.secondary}
              className={submissionsReloadBtnClassName}
            />
        ),
        [ handleReloadClick ],
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

    const buttonsSection = useCallback(
        () => (
            <div className={styles.buttonsSection}>
                { renderReloadButton() }
                { renderRetestButton() }
            </div>
        ),
        [ renderReloadButton, renderRetestButton ],
    );

    const renderSubmissionInfo = useCallback(
        () => {
            if (!canAccessAdministration || isNil(currentSubmission)) {
                return null;
            }

            const { createdOn, modifiedOn, user: { userName } } = currentSubmission;

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
                <div className={submissionsNavigationClassName}>
                    <Heading type={HeadingType.secondary}>Submissions</Heading>
                </div>
                <RefreshableSubmissionsList
                  items={currentProblemSubmissionResults}
                  selectedSubmission={currentSubmission}
                  className={styles.submissionsList}
                  renderExternalElements={buttonsSection}
                />
                { renderSubmissionInfo() }
            </div>
        ),
        [ buttonsSection, currentProblemSubmissionResults, currentSubmission, renderSubmissionInfo ],
    );

    const codeEditor = useCallback(
        () => (
            <div className={styles.code}>
                <Heading
                  type={HeadingType.secondary}
                  className={styles.taskHeading}
                >
                    <div className={styles.btnContainer}>
                        <LeftArrowIcon className={styles.leftArrow} size={IconSize.Large} />
                        <LinkButton
                          type={LinkButtonType.secondary}
                          size={ButtonSize.small}
                          to={registerContestTypeUrl}
                          className={styles.backBtn}
                          text="Back To Contest"
                          state={backButtonState}
                        />
                    </div>
                    <div>
                        {problemNameHeadingText}
                    </div>
                    <div className={styles.itemInvisible}>Other</div>
                </Heading>
                <CodeEditor
                  readOnly
                  code={currentSubmission?.content}
                  selectedSubmissionType={submissionType}
                />
            </div>
        ),
        [ problemNameHeadingText, currentSubmission?.content, submissionType, backButtonState, registerContestTypeUrl ],
    );

    const submissionResults = useCallback(
        () => (
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
        ),
        [ currentSubmission, detailsHeadingText, submissionDetailsClassName ],
    );

    const renderErrorHeading = useCallback(
        (message: string) => (
            <div className={styles.headingContest}>
                <Heading
                  type={HeadingType.primary}
                  className={styles.contestHeading}
                >
                    {message}
                </Heading>
            </div>
        ),
        [],
    );

    const renderErrorMessage = useCallback(
        () => {
            const error = first(validationErrors);
            if (!isNil(error)) {
                const { detail } = error;
                return renderErrorHeading(detail);
            }

            return null;
        },
        [ renderErrorHeading, validationErrors ],
    );

    const renderSubmission = useCallback(
        () => (
            <div className={styles.detailsWrapper}>
                <div>{refreshableSubmissionsList()}</div>
                <div>{codeEditor()}</div>
                <div>{submissionResults()}</div>
            </div>
        ),
        [ codeEditor, refreshableSubmissionsList, submissionResults ],
    );

    const renderPage = useCallback(
        () => isEmpty(validationErrors)
            ? renderSubmission()
            : renderErrorMessage(),
        [ renderErrorMessage, validationErrors, renderSubmission ],
    );

    if (isNil(currentSubmission) && isEmpty(validationErrors)) {
        return <div>No details fetched.</div>;
    }

    return renderPage();
};

export default SubmissionDetails;
