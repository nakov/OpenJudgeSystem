import * as React from 'react';
import { useCallback, useMemo } from 'react';
import Heading from '../../guidelines/headings/Heading';
import ContestTasksNavigation from '../contest-tasks-navigation/ContestTasksNavigation';
import SubmissionBox from '../submission-box/SubmissionBox';
import ContestProblemDetails from '../contest-problem-details/ContestProblemDetails';

import concatClassNames from '../../../utils/class-names';

import styles from './Contest.module.scss';
import Text, { TextType } from '../../guidelines/text/Text';
import Countdown, { ICountdownRemainingType } from '../../guidelines/countdown/Countdown';
import { convertToSecondsRemaining, convertToTwoDigitValues } from '../../../utils/dates';
import { useCurrentContest } from '../../../hooks/use-current-contest';

const Contest = () => {
    const {
        state: {
            contest,
            score,
            maxScore,
        },
    } = useCurrentContest();

    const navigationClassName = concatClassNames(
        styles.sizeThree,
        styles.container,
    );

    const submissionBoxClassName = concatClassNames(
        styles.sizeRest,
        styles.container,
    );

    const problemInfoClassName = concatClassNames(
        styles.sizeThree,
        styles.container,
    );

    const scoreText = useMemo(
        () => `${score}/${maxScore}`,
        [ maxScore, score ],
    );

    const renderScore = useCallback(
        () => {
            if (scoreText === '0/0') {
                return null;
            }

            return (
                <p>
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

    const renderCountdown = useCallback(
        (remainingTime: ICountdownRemainingType) => {
            const { hours, minutes, seconds } = convertToTwoDigitValues(remainingTime);
            return (
                <>
                    <p>
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
                <Countdown renderRemainingTime={renderCountdown} duration={duration} metric="seconds" />
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
                <Heading type="primary" className={styles.contestHeading}>
                    {contest?.name}
                </Heading>
                <Heading type="secondary" className={secondaryHeadingClassName}>
                    {renderTimeRemaining()}
                    {renderScore()}
                </Heading>
            </div>

            <div className={styles.contestWrapper}>
                <div className={navigationClassName}>
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
