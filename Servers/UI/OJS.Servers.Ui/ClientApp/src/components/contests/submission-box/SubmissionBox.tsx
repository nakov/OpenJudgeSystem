import React, { useCallback, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { ISubmissionTypeType } from '../../../common/types';
import { useSubmissions } from '../../../hooks/submissions/use-submissions';
import { useCurrentContest } from '../../../hooks/use-current-contest';
import { useProblems } from '../../../hooks/use-problems';
import concatClassNames from '../../../utils/class-names';
import { convertToTwoDigitValues } from '../../../utils/dates';
import CodeEditor from '../../code-editor/CodeEditor';
import AlertBox, { AlertBoxType } from '../../guidelines/alert-box/AlertBox';
import { Button, ButtonState } from '../../guidelines/buttons/Button';
import Countdown, { ICountdownRemainingType, Metric } from '../../guidelines/countdown/Countdown';
import FileUploader from '../../guidelines/file-uploader/FileUploader';
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
            submitMessage,
            setSubmitMessage,
            isSubmissionSuccessful,
            problemSubmissionCode,
        },
        actions: {
            submit,
            updateSubmissionCode,
            selectSubmissionTypeById,
        },
    } = useSubmissions();

    const { state: { currentProblem } } = useProblems();
    const { allowedSubmissionTypes } = currentProblem || {};

    const showSubmissionLimitTimer = useMemo(() => submitLimit > 0, [ submitLimit ]);

    const handleCodeChanged = useCallback(
        (newValue: string | File) => {
            updateSubmissionCode(newValue);
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

    const restartSubmissionTimeLimitCountdown = useCallback((force = false) => {
        if (!force) {
            return;
        }

        if (!isNil(contest) && contest.limitBetweenSubmissions !== 0) {
            setSubmitLimit(contest.limitBetweenSubmissions as number);
        }
    }, [ contest ]);

    const handleOnSubmit = useCallback(async () => {
        await submit();
        const { id: problemId } = currentProblem || {};
        if (isNil(problemId)) {
            return;
        }

        delete problemSubmissionCode[problemId];
    }, [ submit, currentProblem, problemSubmissionCode ]);

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

    const renderCountdown = useCallback(() => {
        if (!showSubmissionLimitTimer) {
            return null;
        }

        return (
            <Countdown
              duration={submitLimit}
              metric={Metric.seconds}
              renderRemainingTime={renderSubmissionLimitCountdown}
              handleOnCountdownEnd={() => {
                  setSubmitLimit(0);
              }}
            />
        );
    }, [ showSubmissionLimitTimer, renderSubmissionLimitCountdown, submitLimit ]);

    const renderSubmitBtn = useCallback(() => {
        const state = !isSubmitAllowed || showSubmissionLimitTimer
            ? ButtonState.disabled
            : ButtonState.enabled;

        return (
            <Button
              text="Submit"
              state={state}
              onClick={handleOnSubmit}
            />
        );
    }, [ handleOnSubmit, showSubmissionLimitTimer, isSubmitAllowed ]);

    const renderSubmitMessage = useCallback(() => {
        if (isNil(submitMessage)) {
            return null;
        }

        return (
            <AlertBox
              message={submitMessage}
              type={AlertBoxType.error}
              onClose={() => setSubmitMessage(null)}
            />
        );
    }, [ setSubmitMessage, submitMessage ]);

    useEffect(() => {
        setSubmitLimit(userSubmissionsTimeLimit);
    }, [ userSubmissionsTimeLimit ]);

    useEffect(() => {
        if (!isNil(isSubmissionSuccessful) && isSubmissionSuccessful) {
            restartSubmissionTimeLimitCountdown(true);
        }
    }, [ restartSubmissionTimeLimitCountdown, isSubmissionSuccessful ]);

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

    const renderSubmissionInput = useCallback(() => {
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
                    />
                    <p className={styles.fileSubmissionDetailsParagraph}>
                        Allowed file extensions:
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
    }, [ handleCodeChanged, selectedSubmissionType, submissionCode, currentProblem ]);

    return (
        <div className={styles.contestMainWrapper}>
            <Heading
              type={HeadingType.secondary}
              className={styles.heading}
            >
                {taskText}
                <span className={styles.taskName}>
                    {currentProblem?.name}
                </span>
            </Heading>
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
    );
};

export default SubmissionBox;
