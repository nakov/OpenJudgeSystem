import { concatClassnames } from 'react-alice-carousel/lib/utils';
import { IoIosLock } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import isNil from 'lodash/isNil';

import { ContestParticipationType } from '../../../common/constants';
import {
    createUrlFriendlyString,
    getCompeteResultsAreVisible,
    getPracticeResultsAreVisible,
} from '../../../common/contest-helpers';
import { IIndexContestsType } from '../../../common/types';
import { getContestsDetailsPageUrl, getContestsResultsPageUrl } from '../../../common/urls/compose-client-urls';
import useTheme from '../../../hooks/use-theme';
import { useAppSelector } from '../../../redux/store';
import {
    calculatedTimeFormatted,
    calculateTimeUntil,
    dateTimeFormatWithSpacing,
    isCurrentTimeAfterOrEqualTo,
    preciseFormatDate,
} from '../../../utils/dates';
import ContestButton from '../contest-button/ContestButton';

import styles from './ContestCard.module.scss';

interface IContestCardProps {
    contest: IIndexContestsType;
    showPoints?: boolean;
}

const iconNames = {
    time: 'far fa-clock',
    date: 'far fa-calendar-alt',
    numberOfProblems: 'fas fa-file',
    practiceResults: 'fas fa-user',
    competeResults: 'fas fa-user',
    remainingTime: 'far fa-clock',
};

const ContestCard = (props: IContestCardProps) => {
    const { contest, showPoints } = props;

    const { themeColors, getColorClassName } = useTheme();
    const { internalUser, isLoggedIn } = useAppSelector((reduxState) => reduxState.authorization);

    const textColorClass = getColorClassName(themeColors.textColor);
    const backgroundColorClass = getColorClassName(themeColors.baseColor200);

    const {
        id,
        name,
        category,
        canBeCompeted,
        canBePracticed,
        practiceStartTime,
        practiceEndTime,
        startTime,
        endTime,
        numberOfProblems,
        competeResults,
        practiceResults,
        competeMaximumPoints,
        practiceMaximumPoints,
        userParticipationResult,
        requirePasswordForCompete,
        requirePasswordForPractice,
    } = contest;

    const contestStartTime = canBeCompeted || (!canBeCompeted && !canBePracticed)
        ? startTime
        : practiceStartTime;

    const contestEndTime = canBeCompeted
        ? endTime
        : practiceEndTime;

    const hasContestStartTimePassed = isCurrentTimeAfterOrEqualTo(contestStartTime);

    const remainingDuration = calculateTimeUntil(contestEndTime);
    const remainingTimeFormatted = calculatedTimeFormatted(remainingDuration);

    const shouldShowPoints = isNil(showPoints)
        ? true
        : showPoints;

    const isUserAdminOrLecturer = internalUser.isAdmin || internalUser.isLecturer;

    const renderContestDetailsFragment = (
        iconName: string,
        text: string | number | undefined,
        tooltipTitle?: string,
        isGreenColor?: boolean,
        hasUnderLine?: boolean,
        participationType?: string,
    ) => {
        if (!text || !iconName) {
            return;
        }

        const renderBody = () => (
            <>
                {' '}
                <i className={`${iconName}`} />
                <div className={`${hasUnderLine
                    ? styles.hasUnderLine
                    : ''}`}
                >
                    {text}
                </div>
            </>
        );

        const content = participationType
            ? (
                <Link
                  className={`${styles.contestDetailsFragment} ${isGreenColor
                      ? styles.greenColor
                      : ''}`}
                  to={getContestsResultsPageUrl({
                      slug: createUrlFriendlyString(name),
                      contestId: id!,
                      participationType: participationType === ContestParticipationType.Compete
                          ? ContestParticipationType.Compete
                          : ContestParticipationType.Practice,
                      isSimple: true,
                  })}
                >
                    {renderBody()}
                </Link>
            )
            : (
                <div className={`${styles.contestDetailsFragment} ${isGreenColor
                    ? styles.greenColor
                    : ''}`}
                >
                    {renderBody()}
                </div>
            );

        // eslint-disable-next-line consistent-return
        return (
            tooltipTitle
                ? (
                    <Tooltip title={tooltipTitle}>
                        {content}
                    </Tooltip>
                )
                : content
        );
    };

    const renderPointsText = (totalPoints: number, pointsReceived?: number) => !isNil(pointsReceived) && (
        <span className={styles.points}>
            {`${pointsReceived} / ${totalPoints}`}
        </span>
    );

    const renderContestButton = (isCompete: boolean) => {
        const isDisabled = isCompete
            ? !canBeCompeted
            : !canBePracticed;

        return (
            <ContestButton isCompete={isCompete} isDisabled={isDisabled} id={id} name={name} />
        );
    };

    const renderLockIcon = (isCompete: boolean, requirePassword: boolean) => {
        if (!requirePassword) {
            return <IoIosLock className={styles.hideLock} size="24px" />;
        }

        const isDisabled = isCompete
            ? !canBeCompeted
            : !canBePracticed;

        const lockClassName = isDisabled && isUserAdminOrLecturer
            ? concatClassnames(isCompete
                ? styles.competeLock
                : styles.practiceLock, styles.lockFaint)
            : isCompete
                ? styles.competeLock
                : styles.practiceLock;

        return (
            <IoIosLock
              className={isDisabled && !isUserAdminOrLecturer
                  ? styles.hideLock
                  : lockClassName}
              size="24px"
            />
        );
    };

    return (
        <div className={`${backgroundColorClass} ${textColorClass} ${styles.contestCardWrapper}`}>
            <div>
                <Link className={styles.contestCardTitle} to={getContestsDetailsPageUrl({ contestId: id, contestName: name })}>
                    {name}
                </Link>
                <div className={styles.contestCardSubTitle}>{category}</div>
                {
                    isLoggedIn && internalUser.canAccessAdministration && <div className={styles.contestCardSubTitle}>{id}</div>
                }
                <div className={styles.contestDetailsFragmentsWrapper}>
                    {contestStartTime && renderContestDetailsFragment(
                        iconNames.date,
                        preciseFormatDate(contestStartTime, dateTimeFormatWithSpacing),
                        'Contest\'s start date',
                    )}
                    {renderContestDetailsFragment(iconNames.numberOfProblems, numberOfProblems, 'Problem count')}
                    {
                        getPracticeResultsAreVisible(contest, internalUser.canAccessAdministration) &&
                        renderContestDetailsFragment(
                            iconNames.practiceResults,
                            `Practice results: ${practiceResults}`,
                            undefined,
                            false,
                            true,
                            ContestParticipationType.Practice,
                        )
}
                    {
                        // Null compete points means user is not compete participant
                        getCompeteResultsAreVisible(contest, internalUser.canAccessAdministration) &&
                        renderContestDetailsFragment(
                            iconNames.competeResults,
                            `Compete results: ${competeResults}`,
                            undefined,
                            true,
                            true,
                            ContestParticipationType.Compete,
                        )
                    }
                    {contestEndTime &&
                        remainingDuration &&
                        remainingDuration.seconds() > 0 &&
                        hasContestStartTimePassed &&
                        renderContestDetailsFragment(
                            iconNames.remainingTime,
                            `remaining time: ${remainingTimeFormatted}`,
                            'Contest\'s remaining time',
                            false,
                            false,
                        )}
                </div>
            </div>
            <div className={styles.contestBtnsWrapper}>
                <div className={styles.buttonAndPointsLabelWrapper}>
                    { shouldShowPoints && renderPointsText(competeMaximumPoints, userParticipationResult?.competePoints)}
                    <div className={styles.buttonAndLockLabelWrapper}>
                        {renderContestButton(true)}
                        {renderLockIcon(true, requirePasswordForCompete)}
                    </div>
                </div>
                <div className={styles.buttonAndPointsLabelWrapper}>
                    { shouldShowPoints && renderPointsText(practiceMaximumPoints, userParticipationResult?.practicePoints)}
                    <div className={styles.buttonAndLockLabelWrapper}>
                        {renderContestButton(false)}
                        {renderLockIcon(false, requirePasswordForPractice)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContestCard;
