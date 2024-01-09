import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isNil from 'lodash/isNil';

import { contestParticipationType } from '../../../../common/contest-helpers';
import { ISubmissionDetailsReduxState } from '../../../../common/types';
import { useAuth } from '../../../../hooks/use-auth';
import { useProblems } from '../../../../hooks/use-problems';
import { setDownloadErrorMessage, setSubmission } from '../../../../redux/features/submissionDetailsSlice';
import { useSaveAttachmentQuery } from '../../../../redux/services/submissionDetailsService';
import concatClassNames from '../../../../utils/class-names';
import { getParticipateInContestUrl } from '../../../../utils/urls';
import CodeEditor from '../../../code-editor/CodeEditor';
import AlertBox, { AlertBoxType } from '../../../guidelines/alert-box/AlertBox';
import Button, { ButtonSize, ButtonState, ButtonType } from '../../../guidelines/buttons/Button';
import Heading, { HeadingType } from '../../../guidelines/headings/Heading';
import IconSize from '../../../guidelines/icons/common/icon-sizes';
import LeftArrowIcon from '../../../guidelines/icons/LeftArrowIcon';
import RetestButton from '../refreshable-submission-list/RetestButton';

import styles from './SubmissionDetailsCodeEditor.module.scss';

const SubmissionDetailsCodeEditor = () => {
    const [ submissionId, setSubmissionId ] = useState<number | null>(null);
    const [ shouldFetch, setShouldFetch ] = useState<boolean>(true);
    const [ testsChangedBoxClosed, setTestsChangedBoxClosed ] = useState<boolean>(false);
    const { actions: { initiateRedirectionToProblem } } = useProblems();
    const { state: { user } } = useAuth();
    const { currentSubmission, downloadErrorMessage } =
    useSelector((state: {submissionDetails: ISubmissionDetailsReduxState}) => state.submissionDetails);

    const { state: { user: { permissions: { canAccessAdministration } } } } = useAuth();
    const dispatch = useDispatch();

    const { retestIsSuccess } =
        useSelector((state: {
            submissionDetails: ISubmissionDetailsReduxState;
        }) => state.submissionDetails);

    const { data, error } = useSaveAttachmentQuery({ id: submissionId! }, { skip: shouldFetch });

    useEffect(() => {
        if (error && 'error' in error) {
            dispatch(setDownloadErrorMessage(error.error));
        }
    }, [ dispatch, error ]);

    const downloadFile = (blob:Blob, filename: string) => {
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = blobUrl;
        // eslint-disable-next-line prefer-destructuring
        a.download = filename;

        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
    };

    useEffect(() => {
        if (data?.blob) {
            downloadFile(data.blob, data.filename);
        }
    }, [ data ]);

    const handleDownloadSubmissionFile = useCallback(
        async () => {
            if (!isNil(downloadErrorMessage)) {
                return;
            }
            setShouldFetch(false);
            setSubmissionId(Number(currentSubmission!.id));
        },
        [ currentSubmission, downloadErrorMessage ],
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

    const problemNameHeadingText = useMemo(
        () => {
            if (!currentSubmission) {
                return '';
            }

            return `${currentSubmission?.problem.name} - ${currentSubmission?.problem.id}`;
        },
        [ currentSubmission ],
    );

    const { submissionType } = currentSubmission || {};

    const renderRetestSuccessMessage = useCallback(
        () => !isNil(retestIsSuccess) && retestIsSuccess
            ? (
                <AlertBox
                  className={styles.tenPixelsMarginUnder}
                  message="Submission retested successfully."
                  delay={3500}
                  type={AlertBoxType.success}
                />
            )
            : null,
        [ retestIsSuccess ],
    );

    const renderTestsChangeMessage = useCallback(() => (
        !isNil(currentSubmission) &&
        currentSubmission.isProcessed &&
        currentSubmission.isEligibleForRetest &&
        !testsChangedBoxClosed
            ? (
                <div className={concatClassNames(styles.testChangesWrapper, styles.tenPixelsMarginUnder)}>
                    <p>
                        The input/output data changed and your (
                        {currentSubmission.points}
                        /
                        {currentSubmission.problem.maximumPoints}
                        )
                        submission is now outdated.
                        Click &quot;Retest&quot; to resubmit your solution for re-evaluation against the new test cases.
                        Your score may change.
                    </p>
                    <RetestButton
                      onSuccessfulRetest={() => setTestsChangedBoxClosed(true)}
                    />
                </div>
            )
            : ''
    ), [ currentSubmission, testsChangedBoxClosed ]);

    const renderInQueueMessage = useCallback(() => !currentSubmission?.isProcessed
        ? (
            <AlertBox
              className={styles.alertBox}
              message="The submission is in queue and will be processed shortly. Please wait."
              type={AlertBoxType.info}
              isClosable={false}
            />
        )
        : null, [ currentSubmission?.isProcessed ]);

    const backButtonState = useMemo(
        () => isNil(currentSubmission?.contestId)
            ? ButtonState.disabled
            : ButtonState.enabled,
        [ currentSubmission ],
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

            dispatch(setSubmission(null));
        },
        [ currentSubmission, initiateRedirectionToProblem, dispatch ],
    );

    return (
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
            <div className={styles.messagesWrapper}>
                {renderRetestSuccessMessage()}
                {renderTestsChangeMessage()}
                {renderInQueueMessage()}
            </div>
            {submissionType?.allowBinaryFilesUpload
                ? (
                    <div className={styles.resourceWrapper}>
                        {renderResourceLink()}
                        {downloadErrorMessage && (
                        <AlertBox
                          message={downloadErrorMessage}
                          type={AlertBoxType.error}
                          onClose={() => dispatch(setDownloadErrorMessage(null))}
                        />
                        )}
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
    );
};
export default SubmissionDetailsCodeEditor;
