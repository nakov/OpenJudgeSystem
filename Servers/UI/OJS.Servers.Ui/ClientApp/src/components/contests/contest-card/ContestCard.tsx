import { Link } from 'react-router-dom';

import { IIndexContestsType } from '../../../common/types';
import { getContestsResultsUrl } from '../../../common/urls/compose-client-urls';
import useTheme from '../../../hooks/use-theme';
import {
    calculatedTimeFormatted,
    calculateTimeUntil,
    preciseFormatDate,
} from '../../../utils/dates';
import ContestButton from '../contest-button/ContestButton';

import styles from './ContestCard.module.scss';

interface IContestCardProps {
    contest: IIndexContestsType;
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
    const { contest } = props;

    const { themeColors, getColorClassName } = useTheme();

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

    const contestStartTime = canBeCompeted
        ? startTime
        : practiceStartTime;

    const contestEndTime = canBeCompeted
        ? endTime
        : practiceEndTime;

    const remainingDuration = calculateTimeUntil(new Date(contestEndTime));
    const remainingTimeFormatted = calculatedTimeFormatted(remainingDuration);

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

    const renderContestButton = (isCompete: boolean) => {
        const isDisabled = isCompete
            ? !canBeCompeted
            : !canBePracticed;

        return (
            <div className={styles.contestBtn}>
                {userParticipationResult !== null && (
                <div>
                    {
                        isCompete
                            ? userParticipationResult?.competePoints
                            : userParticipationResult?.practicePoints
                    }
                    {' '}
                    /
                    {' '}
                    {
                        isCompete
                            ? competeMaximumPoints
                            : practiceMaximumPoints
                    }
                </div>
                )}
                <ContestButton isCompete={isCompete} isDisabled={isDisabled} id={id} />
            </div>
        );
    };

    return (
        <div className={`${backgroundColorClass} ${textColorClass} ${styles.contestCardWrapper}`}>
            <div>
                <Link className={styles.contestCardTitle} to={`/contests/${id}`}>
                    {name}
                </Link>
                <div className={styles.contestCardSubTitle}>{category}</div>
                <div className={styles.contestDetailsFragmentsWrapper}>
                    {renderContestDetailsFragment(iconNames.time, preciseFormatDate(new Date(contestStartTime), 'HH:MM'))}
                    {renderContestDetailsFragment(iconNames.date, preciseFormatDate(new Date(contestStartTime), 'D MMM YY'))}
                    {renderContestDetailsFragment(iconNames.numberOfProblems, numberOfProblems)}
                    {renderContestDetailsFragment(
                        iconNames.practiceResults,
                        `practice results: ${practiceResults}`,
                        false,
                        true,
                        'practice',
                    )}
                    {renderContestDetailsFragment(
                        iconNames.competeResults,
                        `compete results: ${competeResults}`,
                        true,
                        true,
                        'compete',
                    )}
                    {canBeCompeted &&
                        contestEndTime &&
                        remainingDuration &&
                        remainingDuration.seconds() > 0 &&
                        renderContestDetailsFragment(
                            iconNames.remainingTime,
                            `remaining time: ${remainingTimeFormatted}`,
                            false,
                            false,
                        )}
                </div>
            </div>
            <div className={styles.contestBtnsWrapper}>
                <div className={styles.contestBtn}>
                    {renderContestButton(true)}
                    {renderContestButton(false)}
                </div>
            </div>
        </div>
    );
};

export default ContestCard;
