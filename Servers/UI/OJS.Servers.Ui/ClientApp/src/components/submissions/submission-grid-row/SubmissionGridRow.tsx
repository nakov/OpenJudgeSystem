import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import isNil from 'lodash/isNil';

import { contestParticipationType } from '../../../common/contest-helpers';
import { ISubmissionResponseModel } from '../../../common/types';
import { useUserProfileSubmissions } from '../../../hooks/submissions/use-profile-submissions';
import { PublicSubmissionState } from '../../../hooks/submissions/use-public-submissions';
import { useProblems } from '../../../hooks/use-problems';
import useTheme from '../../../hooks/use-theme';
import { IAuthorizationReduxState } from '../../../redux/features/authorizationSlice';
import concatClassNames from '../../../utils/class-names';
import { defaultDateTimeFormatReverse, formatDate } from '../../../utils/dates';
import { encodeUsernameAsUrlParam,
    getParticipateInContestUrl,
    getSubmissionDetailsRedirectionUrl,
    getUserProfileInfoUrlByUsername } from '../../../utils/urls';
import { Button, ButtonSize, ButtonType, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';

import styles from './SubmissionGridRow.module.scss';

interface ISubmissionGridRowProps {
    submission: ISubmissionResponseModel;
    isFirst: boolean;
    shouldDisplayUsername?: boolean;
}

const SubmissionGridRow = ({
    submission,
    isFirst,
    shouldDisplayUsername = true,
}: ISubmissionGridRowProps) => {
    const { isDarkMode } = useTheme();
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

            // getContestDetailsAppUrl(contestId)

            initiateRedirectionToProblem(problemId, participateInContestUrl);
        },
        [ contestId, participationType, problemId, initiateRedirectionToProblem ],
    );

    const renderDetailsBtn = useCallback(
        () => {
            if (userameFromSubmission === internalUser.username || internalUser.isAdmin) {
                return (
                    <Button
                      text="Details"
                      onClick={handleDetailsButtonSubmit}
                    />
                );
            }
            return null;
        },
        [ handleDetailsButtonSubmit, internalUser.isAdmin, internalUser.username, userameFromSubmission ],
    );

    // const renderStrategyIcon = useCallback(
    //     () => {
    //         const Icon = strategyTypeToIcon(fullStrategyNameToStrategyType(strategyName));
    //
    //         if (isNil(Icon)) {
    //             return null;
    //         }
    //
    //         return (<Icon size={IconSize.Large} helperText={strategyName} />);
    //     },
    //     [ strategyName ],
    // );

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
                    <span>{problemName}</span>
                </div>
            );
        },
        [ problemId, problemName ],
    );

    const headerClassName = concatClassNames(
        styles.submissionsGridHeader,
        isDarkMode
            ? styles.darkSubmissionsGridHeader
            : styles.lightSubmissionsGridHeader,
    );

    const rowClassName = concatClassNames(
        styles.container,
        isDarkMode
            ? styles.darkRow
            : styles.lightRow,
    );

    return (
        <>
            <div>
                {
                isFirst
                    ? (
                        <div className={headerClassName}>
                            <div className={styles.smallColumn}>N</div>
                            <div className={styles.wideColumn}>Task</div>
                            <div className={styles.wideColumn}>From</div>
                            <div className={concatClassNames(styles.smallColumn, styles.textAlignRight)}>Result</div>
                            <div className={styles.wideColumn} />
                            <div className={styles.smallColumn} />
                        </div>
                    )
                    : null
            }
            </div>
            <div className={rowClassName}>
                <div
                  className={styles.smallColumn}
                >
                    #
                    {submissionId}
                </div>
                <div className={styles.wideColumn}>
                    {renderProblemInformation()}
                    <div className={styles.columnContainer}>
                        <Button
                          type={ButtonType.secondary}
                          size={ButtonSize.small}
                          className={styles.link}
                          internalClassName={styles.redirectButton}
                          onClick={handleParticipateInContestSubmit}
                          text={contestName}
                        />
                    </div>
                </div>
                <div className={styles.wideColumn}>
                    <div className={styles.columnContainer}>
                        <span>
                            {formatDate(createdOn, defaultDateTimeFormatReverse)}
                            {shouldDisplayUsername && renderUsername()}
                        </span>
                    </div>
                </div>
                <div
                  className={concatClassNames(styles.smallColumn, styles.textAlignRight)}
                >
                    {renderPoints()}
                </div>
                <div className={concatClassNames(styles.wideColumn)}>
                    <div>{strategyName}</div>
                </div>
                <div className={styles.smallColumn}>
                    {renderDetailsBtn()}
                </div>
            </div>
        </>
    );
};

export default SubmissionGridRow;
