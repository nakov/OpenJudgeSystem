import React, { useCallback, useMemo } from 'react';
import isNil from 'lodash/isNil';

import { ContestValidationErrors } from '../../../common/constants';
import { useCurrentContest } from '../../../hooks/use-current-contest';
import concatClassNames from '../../../utils/class-names';
import { convertToTwoDigitValues } from '../../../utils/dates';
import Countdown, { ICountdownRemainingType, Metric } from '../../guidelines/countdown/Countdown';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
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
            remainingTimeInMilliseconds,
            validationError,
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

            return <Countdown renderRemainingTime={renderCountdown} duration={currentSeconds} metric={Metric.seconds} />;
        },
        [ remainingTimeInMilliseconds, renderCountdown ],
    );

    const secondaryHeadingClassName = useMemo(
        () => concatClassNames(styles.contestHeading, styles.contestInfoContainer),
        [],
    );

    const determineErrorMessage = useCallback(() => {
        if (!validationError.contestIsFound) {
            return `${contest?.name} - ${ContestValidationErrors.NotFound}`;
        } if (!validationError.contestIsNotExpired) {
            return `${contest?.name} - ${ContestValidationErrors.Expired}`;
        } if (!validationError.isParticipantRegistered) {
            return `${contest?.name} - ${ContestValidationErrors.NotRegistered}`;
        } if (!validationError.contestCanBeCompeted || !validationError.contestCanBePracticed) {
            return `${contest?.name} - ${ContestValidationErrors.NotEligible}`;
        }

        return null;
    }, [ contest, validationError ]);

    const renderErrorMessage = useCallback(() => (
        <div className={styles.headingContest}>
            <Heading
              type={HeadingType.primary}
              className={styles.contestHeading}
            >
                {determineErrorMessage()}
            </Heading>
        </div>
    ), [ determineErrorMessage ]);

    const renderContest = useCallback(
        () => (
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
        ),
        [
            contest,
            navigationContestClassName,
            problemInfoClassName,
            renderScore,
            renderTimeRemaining,
            secondaryHeadingClassName,
            submissionBoxClassName,
        ],
    );

    const renderPage = useCallback(
        () => !isNil(renderErrorMessage())
            ? renderErrorMessage()
            : renderContest(),
        [
            renderErrorMessage,
            renderContest,
        ],
    );

    return renderPage();
};

export default Contest;
