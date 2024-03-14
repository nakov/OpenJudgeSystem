import React, { useCallback } from 'react';
import { FaFlagCheckered } from 'react-icons/all';
import { useSelector } from 'react-redux';
import isNil from 'lodash/isNil';

import { contestParticipationType } from '../../../common/contest-helpers';
import { PublicSubmissionState } from '../../../common/enums';
import { IPublicSubmission } from '../../../common/types';
import { useUserProfileSubmissions } from '../../../hooks/submissions/use-profile-submissions';
import { useProblems } from '../../../hooks/use-problems';
import useTheme from '../../../hooks/use-theme';
import { IAuthorizationReduxState } from '../../../redux/features/authorizationSlice';
import concatClassNames from '../../../utils/class-names';
import { defaultDateTimeFormatReverse, formatDate } from '../../../utils/dates';
import { fullStrategyNameToStrategyType, strategyTypeToIcon } from '../../../utils/strategy-type-utils';
import {
    encodeUsernameAsUrlParam,
    getParticipateInContestUrl,
    getSubmissionDetailsRedirectionUrl,
    getUserProfileInfoUrlByUsername,
} from '../../../utils/urls';
import { Button, ButtonSize, ButtonType, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';
import IconSize from '../../guidelines/icons/common/icon-sizes';
import MemoryIcon from '../../guidelines/icons/MemoryIcon';
import TimeLimitIcon from '../../guidelines/icons/TimeLimitIcon';
import ErrorResult from '../execution-result/ErrorResult';
import ExecutionResult from '../execution-result/ExecutionResult';
import { ISubmissionsGridOptions } from '../submissions-grid/SubmissionsGrid';

import styles from './SubmissionGridRow.module.scss';

interface ISubmissionGridRowProps {
    submission: IPublicSubmission;
    options: ISubmissionsGridOptions;
}

const SubmissionGridRow = ({
    submission,
    options,
}: ISubmissionGridRowProps) => {
    const { isDarkMode, getColorClassName, themeColors } = useTheme();
    const {
        id: submissionId,
        createdOn,
        user,
        result: { points, maxPoints },
        strategyName,
        state,
        problem: {
            id: problemId,
            name: problemName,
            contest: {
                id: contestId,
                name: contestName,
            },
        },
        isOfficial,
        isCompiledSuccessfully,
        maxMemoryUsed,
        maxTimeUsed,
        processed,
        testRuns,
    } = submission;

    const { actions: { initiateRedirectionToProblem } } = useProblems();
    const { internalUser } =
        useSelector((reduxState: {authorization: IAuthorizationReduxState}) => reduxState.authorization);
    const { actions: { getDecodedUsernameFromProfile } } = useUserProfileSubmissions();

    const usernameFromSubmission = isNil(user)
        ? getDecodedUsernameFromProfile()
        : user?.username;

    const participationType = contestParticipationType(isOfficial);

    const handleDetailsButtonSubmit = useCallback(
        () => {
            const submissionDetailsUrl = getSubmissionDetailsRedirectionUrl({ submissionId });

            initiateRedirectionToProblem(problemId, submissionDetailsUrl);
        },
        [ initiateRedirectionToProblem, problemId, submissionId ],
    );

    const handleParticipateInContestSubmit = useCallback(
        () => {
            const participateInContestUrl = getParticipateInContestUrl({
                id: contestId,
                participationType,
            });

            initiateRedirectionToProblem(problemId, participateInContestUrl);
        },
        [ contestId, participationType, problemId, initiateRedirectionToProblem ],
    );

    const renderDetailsBtn = useCallback(
        () => {
            if (usernameFromSubmission === internalUser.userName || internalUser.isAdmin) {
                return (
                    <Button
                      text="Details"
                      internalClassName={
                        concatClassNames(styles.detailsButton, isDarkMode
                            ? styles.darkDetailsButton
                            : styles.lightDetailsButton)
                        }
                      onClick={handleDetailsButtonSubmit}
                      type={ButtonType.plain}
                    />
                );
            }

            return null;
        },
        [ handleDetailsButtonSubmit, internalUser, isDarkMode, usernameFromSubmission ],
    );

    const renderStrategyIcon = useCallback(
        () => {
            const Icon = strategyTypeToIcon(fullStrategyNameToStrategyType(strategyName));

            if (isNil(Icon)) {
                return null;
            }

            return (
                <Icon
                  size={IconSize.Large}
                  className={getColorClassName(themeColors.textColor)}
                />
            );
        },
        [ getColorClassName, strategyName, themeColors.textColor ],
    );

    const renderPoints = useCallback(
        () => {
            if (state === PublicSubmissionState.Processing) {
                return (
                    <>
                        Processing
                    </>
                );
            }

            if (!isCompiledSuccessfully) {
                return <ErrorResult />;
            }

            return (
                <span>
                    {points}
                    {' '}
                    /
                    {maxPoints}
                </span>
            );
        },
        [ state, isCompiledSuccessfully, points, maxPoints ],
    );

    const renderUsername = useCallback(
        () => (
            <>
                {' '}
                by
                {' '}
                <LinkButton
                  type={LinkButtonType.plain}
                  size={ButtonSize.none}
                  to={getUserProfileInfoUrlByUsername(encodeUsernameAsUrlParam(usernameFromSubmission))}
                  text={usernameFromSubmission}
                  internalClassName={styles.redirectButton}
                />
            </>
        ),
        [ usernameFromSubmission ],
    );

    const renderProblemInformation = useCallback(
        () => {
            if (isNil(problemId)) {
                return null;
            }

            return (
                <div>
                    <span>{problemName}</span>
                </div>
            );
        },
        [ problemId, problemName ],
    );

    const hasTestRuns = (s: IPublicSubmission) => (s.testRuns && s.testRuns.length > 0) ?? false;

    const hasTimeAndMemoryUsed = (s: IPublicSubmission) => (!isNil(s.maxMemoryUsed) && !isNil(s.maxTimeUsed)) ?? false;

    const rowClassName = concatClassNames(
        styles.row,
        isDarkMode
            ? styles.darkRow
            : styles.lightRow,
        getColorClassName(themeColors.textColor),
    );

    return (
        <tr key={submission.id} className={rowClassName}>
            <td>
                #
                {submissionId}
            </td>
            <td>
                {
                    options.showTaskDetails
                        ? (
                            <>
                                {renderProblemInformation()}
                                {/* TODO: Fix this to use Link */}
                                <Button
                                  type={ButtonType.secondary}
                                  size={ButtonSize.small}
                                  className={styles.link}
                                  internalClassName={styles.redirectButton}
                                  onClick={handleParticipateInContestSubmit}
                                  text={contestName}
                                />
                            </>
                        )
                        : null
                }
            </td>
            <td>
                <span>
                    {formatDate(createdOn, defaultDateTimeFormatReverse)}
                    {options.showParticipantUsername && renderUsername()}
                </span>
            </td>
            {
                options.showCompeteMarker
                    ? isOfficial
                        ? (
                            <td>
                                <div className={styles.competeIconWrapper}>
                                    <FaFlagCheckered className={styles.competeIcon} />
                                </div>
                            </td>
                        )
                        : <td />
                    : null
            }
            {
                options.showDetailedResults
                    ? (
                        <td>
                            { hasTimeAndMemoryUsed(submission)
                                ? (
                                    <div className={styles.timeAndMemoryContainer}>
                                        <div className={styles.maxMemoryUsed}>
                                            <MemoryIcon
                                              size={IconSize.Large}
                                              className={styles.memoryIcon}
                                            />
                                            <span className={styles.timeAndMemoryText}>
                                                {(maxMemoryUsed / 1000000).toFixed(2)}
                                                {' '}
                                                MB
                                            </span>
                                        </div>
                                        <div className={styles.maxTimeUsed}>
                                            <TimeLimitIcon
                                              size={IconSize.Large}
                                              className={styles.timeIcon}
                                            />
                                            <span className={styles.timeAndMemoryText}>
                                                {maxTimeUsed / 1000}
                                                {' '}
                                                s.
                                            </span>
                                        </div>
                                    </div>
                                )
                                : null}
                        </td>
                    )
                    : null
            }
            <td>
                <div className={styles.executionResultContainer}>
                    {
                        options.showDetailedResults && hasTestRuns(submission)
                            ? (
                                <ExecutionResult
                                  testRuns={testRuns}
                                  isCompiledSuccessfully={isCompiledSuccessfully}
                                  isProcessed={processed}
                                />
                            )
                            : null
                }
                    {renderPoints()}
                </div>
            </td>
            {
                options.showSubmissionTypeInfo
                    ? (
                        <td className={styles.strategy}>
                            {
                                internalUser.isAdmin
                                    ? renderStrategyIcon()
                                    : null
                            }
                            <div>{strategyName}</div>
                        </td>
                    )
                    : null
            }
            <td>
                {renderDetailsBtn()}
            </td>
        </tr>
    );
};

export default SubmissionGridRow;
