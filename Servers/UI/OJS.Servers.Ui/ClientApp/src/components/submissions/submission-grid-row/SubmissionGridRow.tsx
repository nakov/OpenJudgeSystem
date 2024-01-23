import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import isNil from 'lodash/isNil';

import { contestParticipationType } from '../../../common/contest-helpers';
import { ISubmissionResponseModel } from '../../../common/types';
import { useUserProfileSubmissions } from '../../../hooks/submissions/use-profile-submissions';
import { PublicSubmissionState } from '../../../hooks/submissions/use-public-submissions';
import { useProblems } from '../../../hooks/use-problems';
import { IAuthorizationReduxState } from '../../../redux/features/authorizationSlice';
import { formatDate } from '../../../utils/dates';
import { fullStrategyNameToStrategyType, strategyTypeToIcon } from '../../../utils/strategy-type-utils';
import { encodeUsernameAsUrlParam,
    getContestDetailsAppUrl,
    getParticipateInContestUrl,
    getSubmissionDetailsRedirectionUrl,
    getUserProfileInfoUrlByUsername } from '../../../utils/urls';
import { Button, ButtonSize, ButtonType, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';
import IconSize from '../../guidelines/icons/common/icon-sizes';
import ExecutionResult from '../execution-result/ExecutionResult';

import styles from './SubmissionGridRow.module.scss';

interface ISubmissionGridRowProps {
    submission: ISubmissionResponseModel;
    shouldDisplayUsername?: boolean;
}

const SubmissionGridRow = ({ submission, shouldDisplayUsername = true }: ISubmissionGridRowProps) => {
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

    const userameFromSubmission = isNil(user)
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
            if (userameFromSubmission === internalUser.userName || internalUser.isAdmin) {
                return (
                    <Button
                      text="Details"
                      onClick={handleDetailsButtonSubmit}
                    />
                );
            }
            return null;
        },
        [ handleDetailsButtonSubmit, internalUser.isAdmin, internalUser.userName, userameFromSubmission ],
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
            <>
                {' '}
                by
                {' '}
                <LinkButton
                  type={LinkButtonType.plain}
                  size={ButtonSize.none}
                  to={getUserProfileInfoUrlByUsername(encodeUsernameAsUrlParam(userameFromSubmission))}
                  text={userameFromSubmission}
                  internalClassName={styles.redirectButton}
                />
            </>
        ),
        [ userameFromSubmission ],
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
                        {shouldDisplayUsername && renderUsername()}
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
