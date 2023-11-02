import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isNil from 'lodash/isNil';

import { contestParticipationType } from '../../../../common/contest-helpers';
import { useSubmissionsDetails } from '../../../../hooks/submissions/use-submissions-details';
import { useAuth } from '../../../../hooks/use-auth';
import { useProblems } from '../../../../hooks/use-problems';
import { setDownloadErrorMessage, setSubmission } from '../../../../redux/features/submissionDetailsSlice';
import { useSaveAttachmentQuery } from '../../../../redux/services/submissionDetailsService';
import { getParticipateInContestUrl } from '../../../../utils/urls';
import CodeEditor from '../../../code-editor/CodeEditor';
import AlertBox, { AlertBoxType } from '../../../guidelines/alert-box/AlertBox';
import Button, { ButtonSize, ButtonState, ButtonType } from '../../../guidelines/buttons/Button';
import Heading, { HeadingType } from '../../../guidelines/headings/Heading';
import IconSize from '../../../guidelines/icons/common/icon-sizes';
import LeftArrowIcon from '../../../guidelines/icons/LeftArrowIcon';

import styles from './SubmissionDetailsCodeEditor.module.scss';

interface ISubmissionDetailsCodeEditorProps {
    renderRetestButton: () => ReactNode;
}
const SubmissionDetailsCodeEditor = ({ renderRetestButton }: ISubmissionDetailsCodeEditorProps) => {
    const [ submissionId, setSubmissionId ] = useState<number | null>(null);
    const { actions: { selectSubmissionById } } = useSubmissionsDetails();
    const { actions: { initiateRedirectionToProblem } } = useProblems();
    const { state: { user } } = useAuth();
    const { currentSubmission, downloadErrorMessage } =
    useSelector((state: any) => state.submissionDetails);
    const { state: { user: { permissions: { canAccessAdministration } } } } = useAuth();
    const dispatch = useDispatch();
    const { error } = useSaveAttachmentQuery({ id: submissionId }, { skip: true });

    useEffect(() => {
        if (error) {
            dispatch(setDownloadErrorMessage(error));
        }
    }, [ currentSubmission, dispatch, error, setSubmissionId ]);
    const handleDownloadSubmissionFile = useCallback(
        async () => {
            if (!isNil(downloadErrorMessage)) {
                return;
            }
            console.log(Number(currentSubmission.id));
            setSubmissionId(Number(currentSubmission.id));
        },
        [ currentSubmission.id, downloadErrorMessage ],
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
            selectSubmissionById(null);
        },
        [ currentSubmission, selectSubmissionById, initiateRedirectionToProblem, dispatch ],
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
