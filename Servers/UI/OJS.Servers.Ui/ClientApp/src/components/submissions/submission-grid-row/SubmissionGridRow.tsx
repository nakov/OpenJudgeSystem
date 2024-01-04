import React, { useCallback } from 'react';
import isNil from 'lodash/isNil';

import { contestParticipationType } from '../../../common/contest-helpers';
import { ISubmissionResponseModel } from '../../../common/types';
import { PublicSubmissionState } from '../../../hooks/submissions/use-public-submissions';
import { useAuth } from '../../../hooks/use-auth';
import { useProblems } from '../../../hooks/use-problems';
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
    const {
        state: {
            user: {
                username: loggedInUsername,
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

    const createUsernameAsUrlParam = useCallback((usernameFromSubmission: string) => {
        const index = usernameFromSubmission.indexOf('.');

        if (index === -1) {
            return username;
        }

        return usernameFromSubmission.replace(/\./g, '~');
    }, [ username ]);

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

    const renderUsername = useCallback(
        () => (
            <LinkButton
              type={LinkButtonType.plain}
              size={ButtonSize.none}
              to={getUserProfileInfoUrlByUsername(createUsernameAsUrlParam(username))}
              text={username}
              internalClassName={styles.redirectButton}
            />
        ),
        [ createUsernameAsUrlParam, username ],
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
                        {renderUsername()}
                    </span>
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
