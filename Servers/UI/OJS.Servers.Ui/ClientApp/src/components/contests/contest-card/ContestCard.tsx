import { Link } from 'react-router-dom';
import isNil from 'lodash/isNil';
import moment from 'moment/moment';

import { getCompeteResultsAreVisible, getPracticeResultsAreVisible } from '../../../common/contest-helpers';
import { IIndexContestsType } from '../../../common/types';
import { getContestsResultsUrl } from '../../../common/urls/compose-client-urls';
import useTheme from '../../../hooks/use-theme';
import { useAppSelector } from '../../../redux/store';
import {
    calculatedTimeFormatted,
    calculateTimeUntil, dateTimeFormatWithSpacing,
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
    } = contest;

    const contestStartTime = canBeCompeted || (!canBeCompeted && !canBePracticed)
        ? startTime
        : practiceStartTime;

    const contestEndTime = canBeCompeted
        ? endTime
        : practiceEndTime;

    const hasContestStartTimePassed = moment().local().isSameOrAfter(moment(contestStartTime).utc(true).local());

    const remainingDuration = calculateTimeUntil(contestEndTime);
    const remainingTimeFormatted = calculatedTimeFormatted(remainingDuration);

    const shouldShowPoints = isNil(showPoints)
        ? true
        : showPoints;

    const renderContestDetailsFragment = (
        iconName: string, text: string | number | undefined,
        isGreenColor?: boolean, hasUnderLine?: boolean,
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

        // eslint-disable-next-line consistent-return
        return (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
                {participationType
                    ? (
                        <Link
                          className={`${styles.contestDetailsFragment} ${isGreenColor
                              ? styles.greenColor
                              : ''}`}
                          to={getContestsResultsUrl(id!, participationType, true)}
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
                    )}
            </>
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
            <ContestButton isCompete={isCompete} isDisabled={isDisabled} id={id} />
        );
    };

    return (
        <div className={`${backgroundColorClass} ${textColorClass} ${styles.contestCardWrapper}`}>
            <div>
                <Link className={styles.contestCardTitle} to={`/contests/${id}`}>
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
                    )}
                    {renderContestDetailsFragment(iconNames.numberOfProblems, numberOfProblems)}
                    {
                        getPracticeResultsAreVisible(contest, internalUser.canAccessAdministration) &&
                        renderContestDetailsFragment(
                            iconNames.practiceResults,
                            `practice results: ${practiceResults}`,
                            false,
                            true,
                            'practice',
                        )
}
                    {
                        // Null compete points means user is not compete participant
                        getCompeteResultsAreVisible(contest, internalUser.canAccessAdministration) &&
                        renderContestDetailsFragment(
                            iconNames.competeResults,
                            `compete results: ${competeResults}`,
                            true,
                            true,
                            'compete',
                        )
                    }
                    {contestEndTime &&
                        remainingDuration &&
                        remainingDuration.seconds() > 0 &&
                        hasContestStartTimePassed &&
                        renderContestDetailsFragment(
                            iconNames.remainingTime,
                            `remaining time: ${remainingTimeFormatted}`,
                            false,
                            false,
                        )}
                </div>
            </div>
            <div className={styles.contestBtnsWrapper}>
                <div className={styles.buttonAndPointsLabelWrapper}>
                    { shouldShowPoints && renderPointsText(competeMaximumPoints, userParticipationResult?.competePoints)}
                    {renderContestButton(true)}
                </div>
                <div className={styles.buttonAndPointsLabelWrapper}>
                    { shouldShowPoints && renderPointsText(practiceMaximumPoints, userParticipationResult?.practicePoints)}
                    {renderContestButton(false)}
                </div>
            </div>
        </div>
    );
};

export default ContestCard;
