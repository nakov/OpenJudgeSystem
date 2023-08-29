import React, { useCallback, useMemo } from 'react';
import isNil from 'lodash/isNil';

import { ContestParticipationType } from '../../../common/constants';
import { ISubmissionResponseModel, PublicSubmissionState } from '../../../hooks/submissions/use-public-submissions';
import { useAuth } from '../../../hooks/use-auth';
import { formatDate } from '../../../utils/dates';
import { fullStrategyNameToStrategyType, strategyTypeToIcon } from '../../../utils/strategy-type-utils';
import { LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';
import IconSize from '../../guidelines/icons/common/icon-sizes';

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
        problem,
        isOfficial,
    } = submission;

    const { state: loggedInUser } = useAuth();

    const renderDetailsBtn = useCallback(
        () => {
            const { user: { username: loggedInUsername, permissions: { canAccessAdministration } } } = loggedInUser;

            if (username === loggedInUsername || canAccessAdministration) {
                return (
                    <LinkButton
                      to={`/submissions/${submissionId}/details`}
                      text="Details"
                    />
                );
            }
            return null;
        },
        [ loggedInUser, username, submissionId ],
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

    const participationType = useMemo(
        () => isOfficial
            ? ContestParticipationType.Compete
            : ContestParticipationType.Practice,
        [ isOfficial ],
    );

    const renderProblemInformation = useCallback(
        () => {
            if (isNil(problem)) {
                return null;
            }

            const {
                name: problemName,
                contest: {
                    id: contestId,
                    name: contestName,
                },
                orderBy,
            } = problem;

            return (
                <div>
                    <LinkButton
                      text={problemName}
                      to={`/contests/${contestId}/${participationType}#${orderBy + 1}`}
                      type={LinkButtonType.plain}
                      className={styles.link}
                    />
                    in
                    <LinkButton
                      text={contestName}
                      to={`/contests/${contestId}/${participationType}`}
                      type={LinkButtonType.plain}
                      className={styles.link}
                    />
                </div>
            );
        },
        [ participationType, problem ],
    );

    return (
        <div className={styles.container}>
            <div className={styles.strategyContainer}>
                {renderStrategyIcon()}
            </div>
            <div className={styles.pointsContainer}>
                {renderPoints()}
            </div>
            <div className={styles.detailsContainer}>
                {renderProblemInformation()}
                <div className={styles.dateAndUsernameContainer}>
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
                <div className={styles.detailsButtonContainer}>
                    {renderDetailsBtn()}
                </div>
            </div>
        </div>
    );
};

export default SubmissionGridRow;
