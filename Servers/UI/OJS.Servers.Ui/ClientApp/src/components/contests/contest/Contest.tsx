import React, { useCallback, useMemo } from 'react';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import Text, { TextType } from '../../guidelines/text/Text';
import Countdown, { ICountdownRemainingType, Metric } from '../../guidelines/countdown/Countdown';

import ContestTasksNavigation from '../contest-tasks-navigation/ContestTasksNavigation';
import SubmissionBox from '../submission-box/SubmissionBox';
import ContestProblemDetails from '../contest-problem-details/ContestProblemDetails';

import concatClassNames from '../../../utils/class-names';

import { convertToTwoDigitValues } from '../../../utils/dates';
import { useCurrentContest } from '../../../hooks/use-current-contest';

import styles from './Contest.module.scss';

const Contest = () => {
    const {
        state: {
            contest,
            score,
            maxScore,
            remainingTimeInMilliseconds,
            validation,
        },
    } = useCurrentContest();
    
    const navigationContestClass = 'navigationContest';
    const navigationContestClassName = concatClassNames(navigationContestClass);

    const submissionBoxClass = 'submissionBox';
    const submissionBoxClassName = concatClassNames(submissionBoxClass);

    const problemInfoClass = 'problemInfo';
    const problemInfoClassName = concatClassNames(problemInfoClass);

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

    const remainingTimeClassName = 'remainingTime';
    const renderCountdown = useCallback(
        (remainingTime: ICountdownRemainingType) => {
            const { hours, minutes, seconds } = convertToTwoDigitValues(remainingTime);

            return (
                <>
                    <p className={remainingTimeClassName}>
                        Remaining time:
                        {' '}
                        <Text type={TextType.Bold}>
                            {hours}
                            :
                            {minutes}
                            :
                            {seconds}
                        </Text>
                    </p>
                </>
            );
        },
        [],
    );

    const renderTimeRemaining = useCallback(
        () => {
            if (!remainingTimeInMilliseconds) {
                return null;
            }

            const currentSeconds = remainingTimeInMilliseconds / 1000;

            return (
                <Countdown renderRemainingTime={renderCountdown} duration={currentSeconds} metric={Metric.seconds}/>
            );
        },
        [ remainingTimeInMilliseconds, renderCountdown ],
    );

    const secondaryHeadingClassName = useMemo(
        () => concatClassNames(styles.contestHeading, styles.contestInfoContainer),
        [],
    );
    
    const errorMessage = useMemo(
        () => !validation.contestIsFound
            ? `${contest?.name} - Contest not found!`
            : validation.contestIsExpired
                ? `${contest?.name} - Contest expired!`
                : !validation.isParticipantRegistered
                    ? `${contest?.name} - You are not registered for this contest!` 
                    : !validation.contestCanBeCompeted || !validation.contestCanBePracticed
                        ? `${contest?.name} - You can not take part in the contest!`
                        : null,
        [ validation, contest ],
    );

    return (
        <>
            {errorMessage !== null
                ? <div className={styles.headingContest}>
                    <Heading
                        type={HeadingType.primary}
                        className={styles.contestHeading}
                    >
                        {errorMessage}
                    </Heading>
                </div>
                : <>
                    <div className={styles.headingContest}>
                        <Heading
                        type={HeadingType.primary}
                        className={styles.contestHeading}
                    >
                            {contest?.name}
                        </Heading>
                        <Heading type={HeadingType.secondary} className={secondaryHeadingClassName}>
                            {renderTimeRemaining()}
                            {renderScore()}
                        </Heading>
                    </div>

                    <div className={styles.contestWrapper}>
                        <div className={navigationContestClassName}>
                            <ContestTasksNavigation/>
                        </div>
                        <div className={submissionBoxClassName}>
                            <SubmissionBox/>
                        </div>
                        <div className={problemInfoClassName}>
                            <ContestProblemDetails/>
                        </div>
                    </div>
                </>
                }
        </>
    );
};

export default Contest;
