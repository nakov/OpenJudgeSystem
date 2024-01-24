import React, { useCallback, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { ExcludedFromHomeWorkTaskHeadingAddition } from '../../../common/constants';
import { ISubmissionTypeType } from '../../../common/types';
import { useSubmissions } from '../../../hooks/submissions/use-submissions';
import { useCurrentContest } from '../../../hooks/use-current-contest';
import { useProblems } from '../../../hooks/use-problems';
import concatClassNames from '../../../utils/class-names';
import { convertToTwoDigitValues } from '../../../utils/dates';
import { administrationDeleteProblem, administrationEditProblem, getAdministrationParticipants, getAdministrationTestsByProblem } from '../../../utils/urls';
import CodeEditor from '../../code-editor/CodeEditor';
import FileUploader from '../../file-uploader/FileUploader';
import AlertBox, { AlertBoxType } from '../../guidelines/alert-box/AlertBox';
import { Button, ButtonSize, ButtonState, ButtonType } from '../../guidelines/buttons/Button';
import Countdown, { ICountdownRemainingType, Metric } from '../../guidelines/countdown/Countdown';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import List, { Orientation } from '../../guidelines/lists/List';
import ExecutionTypeSelector from '../execution-type-selector/ExecutionTypeSelector';

import styles from './SubmissionBox.module.scss';

const SubmissionBox = () => {
    const [ submitLimit, setSubmitLimit ] = useState<number>(0);
    const {
        state: {
            contest,
            userSubmissionsTimeLimit,
            isSubmitAllowed,
        },
    } = useCurrentContest();
    const {
        state: {
            selectedSubmissionType,
            problemSubmissionCode,
            problemSubmissionErrors,
            alertBoxErrorIsClosed,
        },
        actions: {
            submit,
            updateSubmissionCode,
            selectSubmissionTypeById,
            removeProblemSubmissionCode,
            closeErrorMessage,
            setProblemSubmissionError,
        },
    } = useSubmissions();

    const { state: { currentProblem } } = useProblems();
    const { allowedSubmissionTypes } = currentProblem || {};

    const showSubmissionLimitTimer = useMemo(
        () => {
            const { id: problemId } = currentProblem || {};
            if (isNil(problemId)) {
                return false;
            }

            const { [problemId.toString()]: error } = problemSubmissionErrors;

            return isNil(error) && submitLimit > 0 && !alertBoxErrorIsClosed;
        },
        [ submitLimit, currentProblem, problemSubmissionErrors, alertBoxErrorIsClosed ],
    );

    const handleCodeChanged = useCallback(
        (newValue: string | undefined) => {
            updateSubmissionCode(newValue ?? '');
        },
        [ updateSubmissionCode ],
    );

    const handleSelectExecutionType = useCallback(
        (id: number) => {
            selectSubmissionTypeById(id);
        },
        [ selectSubmissionTypeById ],
    );

    const renderSubmissionTypesSelectors = useCallback(
        (submissionType: ISubmissionTypeType) => {
            const { id, name } = submissionType;
            const isSelected = allowedSubmissionTypes && allowedSubmissionTypes.length === 1
                ? true
                : submissionType.isSelectedByDefault;

            return (
                <ExecutionTypeSelector
                  id={id}
                  value={name}
                  isSelected={isSelected}
                  onSelect={() => handleSelectExecutionType(id)}
                />
            );
        },
        [ allowedSubmissionTypes, handleSelectExecutionType ],
    );

    const renderSubmissionTypesSelectorsList = useCallback(
        () => {
            if (isNil(currentProblem)) {
                return null;
            }

            if (isNil(allowedSubmissionTypes)) {
                return null;
            }

            return (
                <List
                  className={styles.submissionTypesList}
                  values={allowedSubmissionTypes}
                  itemFunc={renderSubmissionTypesSelectors}
                  orientation={Orientation.horizontal}
                  wrap
                />
            );
        },
        [ allowedSubmissionTypes, currentProblem, renderSubmissionTypesSelectors ],
    );

    const restartSubmissionTimeLimitCountdown = useCallback(
        () => {
            if (isNil(contest) || contest.limitBetweenSubmissions === 0) {
                return;
            }

            setSubmitLimit(contest.limitBetweenSubmissions);
        },
        [ contest ],
    );

    const handleOnSubmit = useCallback(
        async () => {
            await submit();
            const { id: problemId } = currentProblem || {};
            if (isNil(problemId)) {
                return;
            }

            if (isNil(problemSubmissionCode[problemId]) ||
                problemSubmissionCode[problemId] === '') {
                return;
            }

            const { [problemId.toString()]: error } = problemSubmissionErrors;

            removeProblemSubmissionCode(problemId);
            if (isNil(error)) {
                restartSubmissionTimeLimitCountdown();
            }
        },
        [
            submit,
            currentProblem,
            problemSubmissionCode,
            removeProblemSubmissionCode,
            restartSubmissionTimeLimitCountdown,
            problemSubmissionErrors,
        ],
    );

    const renderSubmissionLimitCountdown = useCallback((remainingTime: ICountdownRemainingType) => {
        const { minutes, seconds } = convertToTwoDigitValues(remainingTime);

        return (
            <p>
                <span>
                    {minutes}
                    :
                    {seconds}
                </span>
                {' '}
                until next submit
            </p>
        );
    }, []);

    const handleOnCountdownEnd = useCallback(
        () => {
            setSubmitLimit(0);
        },
        [],
    );

    const renderCountdown = useCallback(
        () => {
            if (!showSubmissionLimitTimer) {
                return null;
            }

            return (
                <Countdown
                  duration={submitLimit}
                  metric={Metric.seconds}
                  renderRemainingTime={renderSubmissionLimitCountdown}
                  handleOnCountdownEnd={handleOnCountdownEnd}
                />
            );
        },
        [ handleOnCountdownEnd, renderSubmissionLimitCountdown, showSubmissionLimitTimer, submitLimit ],
    );

    const renderSubmitBtn = useCallback(() => {
        const { id: problemId } = currentProblem || {};
        if (isNil(problemId)) {
            return null;
        }

        const state = !isSubmitAllowed || showSubmissionLimitTimer || problemSubmissionErrors[problemId]
            ? ButtonState.disabled
            : ButtonState.enabled;

        return (
            <Button
              text="Submit"
              state={state}
              onClick={handleOnSubmit}
            />
        );
    }, [ handleOnSubmit, showSubmissionLimitTimer, isSubmitAllowed, currentProblem, problemSubmissionErrors ]);

    const renderAlertBox = useCallback(
        (messageText : string, problemId : number) => (
            <AlertBox
              message={messageText}
              type={AlertBoxType.error}
              onClose={() => closeErrorMessage(problemId.toString())}
            />
        ),
        [ closeErrorMessage ],
    );

    const renderSubmitMessage = useCallback(
        () => {
            const { id: problemId } = currentProblem || {};
            if (isNil(problemId)) {
                return null;
            }

            const { [problemId.toString()]: error } = problemSubmissionErrors;

            if (isNil(error)) {
                return null;
            }

            const { detail } = error;

            return renderAlertBox(detail, problemId);
        },
        [ currentProblem, problemSubmissionErrors, renderAlertBox ],
    );

    useEffect(
        () => {
            setSubmitLimit(userSubmissionsTimeLimit);
        },
        [ userSubmissionsTimeLimit ],
    );

    const taskText = 'Task: ';
    const executionTypeListClass = 'executionTypeLis';
    const executionTypeListClassName = concatClassNames(
        styles.executionTypeSelectors,
        executionTypeListClass,
    );

    const submissionCode = useMemo(
        () => {
            const { id: problemId } = currentProblem || {};
            if (isNil(problemId)) {
                return null;
            }
            return problemSubmissionCode[problemId];
        },
        [ currentProblem, problemSubmissionCode ],
    );

    const renderSubmissionInput = useCallback(
        () => {
            if (isNil(selectedSubmissionType)) {
                return <p>No submission type selected.</p>;
            }

            const { allowBinaryFilesUpload, allowedFileExtensions } = selectedSubmissionType;
            const { id: problemId } = currentProblem || {};
            if (isNil(problemId)) {
                return null;
            }

            if (allowBinaryFilesUpload && !isNil(currentProblem)) {
                return (
                    <>
                        <FileUploader
                          file={isNil(submissionCode) || submissionCode instanceof String
                              ? null
                              : submissionCode as File}
                          problemId={problemId}
                          allowedFileExtensions={allowedFileExtensions}
                          onInvalidFileExtension={setProblemSubmissionError}
                        />
                        <p className={styles.fileSubmissionDetailsParagraph}>
                            Allowed file extensions:
                            {' '}
                            {allowedFileExtensions.join(', ')}
                        </p>
                    </>
                );
            }

            return (
                <CodeEditor
                  selectedSubmissionType={selectedSubmissionType}
                  code={isNil(submissionCode) || submissionCode instanceof File
                      ? ''
                      : submissionCode}
                  onCodeChange={handleCodeChanged}
                />
            );
        },
        [ handleCodeChanged, selectedSubmissionType, submissionCode, currentProblem, setProblemSubmissionError ],
    );

    const redirectToAdministration = (url: string) => {
        window.location.href = url;
    };

    const renderSubmissionBox = useCallback(
        () => (
            <div className={styles.contestMainWrapper}>
                <Heading
                  type={HeadingType.secondary}
                  className={styles.heading}
                >
                    {taskText}
                    <span className={styles.taskName}>
                        {currentProblem?.name}
                    </span>
                    {
                    contest?.userIsAdminOrLecturerInContest && (
                    <div className={styles.navigationalButtonsWrapper}>
                        <Button
                          onClick={() => redirectToAdministration(getAdministrationParticipants(Number(contest.id)))}
                          text="Participants"
                          size={ButtonSize.small}
                          type={ButtonType.secondary}
                        />
                        <Button
                          onClick={() => redirectToAdministration(getAdministrationTestsByProblem(Number(currentProblem?.id)))}
                          text="Tests"
                          size={ButtonSize.small}
                          type={ButtonType.secondary}
                        />
                        <Button
                          onClick={() => redirectToAdministration(administrationEditProblem(Number(currentProblem?.id)))}
                          text="Change"
                          size={ButtonSize.small}
                          type={ButtonType.secondary}
                        />
                        <Button
                          onClick={() => redirectToAdministration(administrationDeleteProblem(Number(currentProblem?.id)))}
                          text="Delete"
                          size={ButtonSize.small}
                          type={ButtonType.secondary}
                        />
                    </div>
                    )
                    }
                </Heading>
                {currentProblem?.isExcludedFromHomework && (
                    <Heading
                      type={HeadingType.small}
                      className={styles.heading}
                    >
                        {ExcludedFromHomeWorkTaskHeadingAddition}
                    </Heading>
                )}
                <div className={styles.contestInnerLayout}>
                    <div className={styles.editorAndProblemControlsWrapper}>
                        {renderSubmissionInput()}
                        <div className={styles.contestSubmitControlsWrapper}>
                            <div className={executionTypeListClassName}>
                                {renderSubmissionTypesSelectorsList()}
                            </div>
                            <div className={styles.submitButtonContainer}>
                                {renderSubmitBtn()}
                            </div>
                        </div>
                        <div className={styles.submitCountdownWrapper}>
                            { renderCountdown() }
                        </div>
                        { renderSubmitMessage() }
                    </div>
                </div>
            </div>
        ),
        [
            currentProblem?.name,
            currentProblem?.isExcludedFromHomework,
            executionTypeListClassName,
            renderCountdown,
            renderSubmissionInput,
            renderSubmissionTypesSelectorsList,
            renderSubmitBtn,
            renderSubmitMessage,
            contest?.id,
            contest?.userIsAdminOrLecturerInContest,
            currentProblem?.id,
        ],
    );

    return renderSubmissionBox();
};

export default SubmissionBox;
