import React, { useCallback } from 'react';
import isNil from 'lodash/isNil';

import { contestParticipationType } from '../../../common/contest-helpers';
import { ISubmissionResponseModel, PublicSubmissionState } from '../../../hooks/submissions/use-public-submissions';
import { useAuth } from '../../../hooks/use-auth';
import { useProblems } from '../../../hooks/use-problems';
import { formatDate } from '../../../utils/dates';
import { fullStrategyNameToStrategyType, strategyTypeToIcon } from '../../../utils/strategy-type-utils';
import { getParticipateInContestUrl, getSubmissionDetailsUrl } from '../../../utils/urls';
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
    const { state: loggedInUser } = useAuth();

    const participationType = contestParticipationType(isOfficial);

    const handleDetailsButtonSubmit = useCallback(
        () => {
            const submissionDetailsUrl = getSubmissionDetailsUrl({ id: submissionId });

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
            const { user: { username: loggedInUsername, permissions: { canAccessAdministration } } } = loggedInUser;

            if (username === loggedInUsername || canAccessAdministration) {
                return (
                    <Button
                      text="Details"
                      onClick={handleDetailsButtonSubmit}
                    />
                );
            }
            return null;
        },
        [ handleDetailsButtonSubmit, loggedInUser, username ],
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
                      text={contestName}
                      to={getParticipateInContestUrl({ id: contestId, participationType })}
                      type={LinkButtonType.plain}
                      className={styles.link}
                    />
                </div>
            );
        },
        [ contestId, contestName, handleParticipateInContestSubmit, participationType, problemId, problemName ],
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
                        {username}
                    </span>
                </div>
            </div>
            <ExecutionResult
              testRuns={testRuns}
              maxMemoryUsed={maxMemoryUsed}
              maxTimeUsed={maxTimeUsed}
              isCompiledSuccessfully={isCompiledSuccessfully}
              isProcessed={processed}
            />
            <div className={styles.detailsButtonContainer}>
                {renderDetailsBtn()}
            </div>
        </div>
    );
};

export default SubmissionGridRow;
