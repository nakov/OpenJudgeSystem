import React, { useCallback, useMemo } from 'react';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import Text, { TextType } from '../../guidelines/text/Text';
import Countdown, { ICountdownRemainingType, Metric } from '../../guidelines/countdown/Countdown';

import ContestTasksNavigation from '../contest-tasks-navigation/ContestTasksNavigation';
import SubmissionBox from '../submission-box/SubmissionBox';
import ContestProblemDetails from '../contest-problem-details/ContestProblemDetails';

import concatClassNames from '../../../utils/class-names';

import { convertToSecondsRemaining, convertToTwoDigitValues } from '../../../utils/dates';
import { useCurrentContest } from '../../../hooks/use-current-contest';

import styles from './Contest.module.scss';

const Contest = () => {
    const {
        state: {
            contest,
            score,
            maxScore,
        },
    } = useCurrentContest();

    const navigationContestClass = 'navigationContest';
    const navigationContestClassName = concatClassNames(
        // styles.sizeThree,
        styles.container,
        navigationContestClass,
    );

    const submissionBoxClass = 'submissionBox';
    const submissionBoxClassName = concatClassNames(
        // styles.sizeRest,
        styles.container,
        submissionBoxClass,
    );

    const problemInfoClass = 'problemInfo';
    const problemInfoClassName = concatClassNames(
        // styles.sizeFour,
        styles.container,
        problemInfoClass,
    );

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
            const { endTime } = contest || {};
            if (!endTime) {
                return null;
            }
            const duration = convertToSecondsRemaining(new Date(endTime));
            return (
                <Countdown renderRemainingTime={renderCountdown} duration={duration} metric={Metric.seconds} />
            );
        },
        [ contest, renderCountdown ],
    );

    const secondaryHeadingClassName = useMemo(
        () => concatClassNames(styles.contestHeading, styles.contestInfoContainer),
        [],
    );

    return (
        <>
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
    );
};

export default Contest;
