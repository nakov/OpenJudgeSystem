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
import ErrorResult from '../execution-result/ErrorResult';
import ExecutionResult from '../execution-result/ExecutionResult';

import styles from './SubmissionGridRow.module.scss';

interface ISubmissionGridRowProps {
    submission: ISubmissionResponseModel;
    shouldDisplayUsername?: boolean;
}

const SubmissionGridRow = ({
    submission,
    shouldDisplayUsername = true,
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
            }

            return (
                <>
                    Processing
                </>
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

    const rowClassName = concatClassNames(
        styles.row,
        isDarkMode
            ? styles.darkRow
            : styles.lightRow,
        getColorClassName(themeColors.textColor),
    );

    return (
        <tr className={rowClassName}>
            <td>
                #
                {submissionId}
            </td>
            <td>
                {renderProblemInformation()}
                <Button
                  type={ButtonType.secondary}
                  size={ButtonSize.small}
                  className={styles.link}
                  internalClassName={styles.redirectButton}
                  onClick={handleParticipateInContestSubmit}
                  text={contestName}
                />
            </td>
            <td>
                <span>
                    {formatDate(createdOn, defaultDateTimeFormatReverse)}
                    {shouldDisplayUsername && renderUsername()}
                </span>
            </td>
            <td className={styles.tdRight}>
                {renderPoints()}
            </td>
            {
                internalUser.isAdmin
                    ? (
                        <ExecutionResult
                          testRuns={testRuns}
                          maxMemoryUsed={maxMemoryUsed}
                          maxTimeUsed={maxTimeUsed}
                          isCompiledSuccessfully={isCompiledSuccessfully}
                          isProcessed={processed}
                        />
                    )
                    : null
            }
            <td>
                {strategyName}
            </td>
            <td>
                {renderDetailsBtn()}
            </td>
        </tr>
    );
};

export default SubmissionGridRow;
