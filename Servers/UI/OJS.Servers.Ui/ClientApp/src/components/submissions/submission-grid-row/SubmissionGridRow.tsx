import React, { useCallback } from 'react';
import isNil from 'lodash/isNil';

import { contestParticipationType } from '../../../common/contest-helpers';
import { ISubmissionResponseModel, PublicSubmissionState } from '../../../hooks/submissions/use-public-submissions';
import { useAuth } from '../../../hooks/use-auth';
import { useProblems } from '../../../hooks/use-problems';
import { useUsers } from '../../../hooks/use-users';
import { formatDate } from '../../../utils/dates';
import { fullStrategyNameToStrategyType, strategyTypeToIcon } from '../../../utils/strategy-type-utils';
import {
    getContestDetailsAppUrl,
    getParticipateInContestUrl,
    getSubmissionDetailsRedirectionUrl,
    getUserProfileInfoUrlByUsername,
} from '../../../utils/urls';
import { Button, ButtonSize, ButtonType, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';
import IconSize from '../../guidelines/icons/common/icon-sizes';
import ExecutionResult from '../execution-result/ExecutionResult';

import styles from './SubmissionGridRow.module.scss';

interface ISubmissionGridRowProps {
    submission: ISubmissionResponseModel;
}

const SubmissionGridRow = ({ submission }: ISubmissionGridRowProps) => {
    const {
        id: submissionId,
        createdOn,
        user: { username },
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
    const { actions: { initiateRedirectionToUserProfile } } = useUsers();
    const {
        state: {
            user: {
                username: loggedInUsername,
                isInRole,
                isAdmin,
            },
        },
    } = useAuth();

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
            if (username === loggedInUsername || isAdmin) {
                return (
                    <Button
                      text="Details"
                      onClick={handleDetailsButtonSubmit}
                    />
                );
            }
            return null;
        },
        [ handleDetailsButtonSubmit, isAdmin, loggedInUsername, username ],
    );

    const renderStrategyIcon = useCallback(
        () => {
            const Icon = strategyTypeToIcon(fullStrategyNameToStrategyType(strategyName));

            if (isNil(Icon)) {
                return null;
            }

            return (<Icon size={IconSize.Large} helperText={strategyName} />);
        },
        [ strategyName ],
    );

    const renderPoints = useCallback(
        () => {
            if (state === PublicSubmissionState.Ready) {
                return (
                    <>
                        {points}
                        {' '}
                        /
                        {maxPoints}
                    </>
                );
            }

            return (
                <>
                    Processing
                </>
            );
        },
        [ state, maxPoints, points ],
    );

    const handleUserRedirection = useCallback(
        () => {
            const getUserProfileInfoUrl = getUserProfileInfoUrlByUsername(username);

            initiateRedirectionToUserProfile(username, getUserProfileInfoUrl);
        },
        [ initiateRedirectionToUserProfile, username ],
    );

    const renderUsername = useCallback(
        (userName: string) => (
            isInRole
                ? (
                    <Button
                      internalClassName={styles.redirectButton}
                      type={ButtonType.secondary}
                      text={username}
                      onClick={handleUserRedirection}
                      size={ButtonSize.small}
                    />
                )
                : <span>{userName}</span>
        ),
        [ handleUserRedirection, isInRole, username ],
    );

    const renderProblemInformation = useCallback(
        () => {
            if (isNil(problemId)) {
                return null;
            }

            return (
                <div>
                    <Button
                      internalClassName={styles.redirectButton}
                      type={ButtonType.secondary}
                      text={problemName}
                      onClick={handleParticipateInContestSubmit}
                      size={ButtonSize.small}
                    />
                    in
                    <LinkButton
                      type={LinkButtonType.plain}
                      to={getContestDetailsAppUrl(contestId)}
                      text={contestName}
                      className={styles.link}
                    />
                </div>
            );
        },
        [ contestId, contestName, handleParticipateInContestSubmit, problemId, problemName ],
    );

    return (
        <div className={styles.container}>
            <div className={styles.strategyContainer}>
                {renderStrategyIcon()}
            </div>
            <div
              className={styles.pointsContainer}
              style={{
                  marginRight: !isOfficial
                      ? '37px'
                      : '',
              }}
            >
                {renderPoints()}
            </div>
            { isOfficial && (
                <div className={styles.competeIconWrapper}>
                    <i className={`${styles.competeIcon} fas fa-flag-checkered`} />
                    <span className={styles.competeIconHoverText}>Compete submission</span>
                </div>
            ) }
            <div className={styles.detailsContainer}>
                {renderProblemInformation()}
                <div className={styles.IdAndDateAndUsernameContainer}>
                    <span className={styles.IdContainer}>
                        #
                        {submissionId}
                    </span>
                    <span className="delimiter">
                        |
                    </span>
                    <span>
                        {formatDate(createdOn)}
                        {' '}
                        by
                        {' '}
                    </span>
                    {renderUsername(username)}
                </div>
            </div>
            <div className={styles.executionResultContainer}>
                <ExecutionResult
                  testRuns={testRuns}
                  maxMemoryUsed={maxMemoryUsed}
                  maxTimeUsed={maxTimeUsed}
                  isCompiledSuccessfully={isCompiledSuccessfully}
                  isProcessed={processed}
                />
            </div>
            <div className={styles.detailsButtonContainer}>
                {renderDetailsBtn()}
            </div>
        </div>
    );
};

export default SubmissionGridRow;
