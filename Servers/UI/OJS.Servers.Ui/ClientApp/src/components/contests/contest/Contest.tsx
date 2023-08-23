import React, { useCallback, useEffect, useMemo } from 'react';
import isNil from 'lodash/isNil';

import { useAuth } from '../../../hooks/use-auth';
import { useCurrentContest } from '../../../hooks/use-current-contest';
import { usePageTitles } from '../../../hooks/use-page-titles';
import { useProblems } from '../../../hooks/use-problems';
import concatClassNames from '../../../utils/class-names';
import { convertToSecondsRemaining, getCurrentTimeInUTC } from '../../../utils/dates';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import Countdown, { Metric } from '../../guidelines/countdown/Countdown';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';
import Text, { TextType } from '../../guidelines/text/Text';
import ContestProblemDetails from '../contest-problem-details/ContestProblemDetails';
import ContestTasksNavigation from '../contest-tasks-navigation/ContestTasksNavigation';
import SubmissionBox from '../submission-box/SubmissionBox';

import styles from './Contest.module.scss';

const Contest = () => {
    const {
        state: {
            contest,
            score,
            maxScore,
            endDateTimeForParticipantOrContest,
            totalParticipantsCount,
            activeParticipantsCount,
            isOfficial,
            contestError,
            contestIsLoading,
        },
        actions:
            {
                setIsSubmitAllowed,
                removeCurrentContest,
            },
    } = useCurrentContest();
    const {
        actions: {
            changeCurrentHash,
            removeCurrentProblem,
            removeCurrentProblems,
        },
    } = useProblems();
    const { state: { user: { permissions: { canAccessAdministration } } } } = useAuth();
    const { actions: { setPageTitle } } = usePageTitles();

    const navigationContestClass = 'navigationContest';
    const navigationContestClassName = concatClassNames(styles.navigationContest, navigationContestClass);

    const submissionBoxClass = 'submissionBox';
    const submissionBoxClassName = concatClassNames(submissionBoxClass);

    const problemInfoClass = 'problemInfo';
    const problemInfoClassName = concatClassNames(styles.problemInfo, problemInfoClass);

    const contestTitle = useMemo(
        () => `${contest?.name}`,
        [ contest?.name ],
    );

    useEffect(() => {
        setPageTitle(contestTitle);
    }, [ contestTitle, setPageTitle ]);

    const scoreText = useMemo(
        () => `${score}/${maxScore}`,
        [ maxScore, score ],
    );

    const scoreClassName = 'score';
    const renderScore = useCallback(
        () => {
            if (scoreText === '0/0') {
                return null;
            }

            return (
                <p className={scoreClassName}>
                    Score:
                    {' '}
                    <Text type={TextType.Bold}>
                        {scoreText}
                    </Text>
                </p>
            );
        },
        [ scoreText ],
    );

    const handleCountdownEnd = useCallback(
        () => {
            if (!isNil(endDateTimeForParticipantOrContest) && new Date(endDateTimeForParticipantOrContest) <= getCurrentTimeInUTC()) {
                setIsSubmitAllowed(canAccessAdministration || false);
            }
        },
        [ canAccessAdministration, setIsSubmitAllowed, endDateTimeForParticipantOrContest ],
    );

    const renderTimeRemaining = useCallback(
        () => {
            if (isNil(endDateTimeForParticipantOrContest) || new Date(endDateTimeForParticipantOrContest) < getCurrentTimeInUTC()) {
                return null;
            }

            return (
                <Countdown
                  duration={convertToSecondsRemaining(new Date(endDateTimeForParticipantOrContest))}
                  metric={Metric.seconds}
                  handleOnCountdownEnd={handleCountdownEnd}
                />
            );
        },
        [ endDateTimeForParticipantOrContest, handleCountdownEnd ],
    );

    const secondaryHeadingClassName = useMemo(
        () => concatClassNames(styles.contestHeading, styles.contestInfoContainer),
        [],
    );

    const participantsStateText = useMemo(
        () => isOfficial && contest?.isExam
            ? 'Active'
            : 'Total',
        [ contest?.isExam, isOfficial ],
    );

    const participantsValue = useMemo(
        () => isOfficial && contest?.isExam
            ? activeParticipantsCount
            : totalParticipantsCount,
        [ activeParticipantsCount, contest?.isExam, isOfficial, totalParticipantsCount ],
    );

    const renderParticipants = useCallback(
        () => (
            <span>
                {participantsStateText}
                {' '}
                Participants:
                {' '}
                <Text type={TextType.Bold}>
                    {participantsValue}
                </Text>
            </span>
        ),
        [ participantsStateText, participantsValue ],
    );

    useEffect(
        () => {
            changeCurrentHash();
        },
        [ changeCurrentHash ],
    );

    useEffect(
        () => () => {
            removeCurrentProblem();
            removeCurrentContest();
            removeCurrentProblems();
        },
        [ removeCurrentContest, removeCurrentProblem, removeCurrentProblems ],
    );

    const renderErrorHeading = useCallback(
        (message: string) => (
            <div className={styles.headingContest}>
                <Heading
                  type={HeadingType.primary}
                  className={styles.contestHeading}
                >
                    {message}
                </Heading>
            </div>
        ),
        [],
    );

    const renderErrorMessage = useCallback(
        () => {
            if (!isNil(contestError)) {
                const { detail } = contestError;
                return renderErrorHeading(detail);
            }

            return null;
        },
        [ renderErrorHeading, contestError ],
    );

    const renderContest = useCallback(
        () => (
            <div>
                {contestIsLoading
                    ? (
                        <div style={{ ...flexCenterObjectStyles, height: '500px' }}>
                            <SpinningLoader />
                        </div>
                    )
                    : (
                        <>
                            <div className={styles.headingContest}>
                                <Heading
                                  type={HeadingType.primary}
                                  className={styles.contestHeading}
                                >
                                    {contestTitle}
                                </Heading>
                                <Heading type={HeadingType.secondary} className={secondaryHeadingClassName}>
                                    {renderParticipants()}
                                    {renderTimeRemaining()}
                                    {renderScore()}
                                </Heading>
                            </div>

                            <div className={styles.contestWrapper}>
                                <div className={navigationContestClassName}>
                                    <ContestTasksNavigation />
                                </div>
                                <div className={submissionBoxClassName}>
                                    <SubmissionBox />
                                </div>
                                <div className={problemInfoClassName}>
                                    <ContestProblemDetails />
                                </div>
                            </div>
                        </>
                    )}
            </div>
        ),
        [
            contestTitle,
            navigationContestClassName,
            problemInfoClassName,
            renderScore,
            renderTimeRemaining,
            secondaryHeadingClassName,
            submissionBoxClassName,
            renderParticipants,
            contestIsLoading,
        ],
    );

    const renderPage = useCallback(
        () => isNil(contestError)
            ? renderContest()
            : renderErrorMessage(),
        [ renderErrorMessage, renderContest, contestError ],
    );

    return renderPage();
};

export default Contest;
