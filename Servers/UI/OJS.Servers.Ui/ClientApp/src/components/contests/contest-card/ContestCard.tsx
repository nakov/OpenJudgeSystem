import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import { IIndexContestsType } from '../../../common/types';
import useTheme from '../../../hooks/use-theme';
import { IAuthorizationReduxState } from '../../../redux/features/authorizationSlice';
import { COMPETE_STRING, PRACTICE_STRING } from '../../../utils/constants';
import {
    calculatedTimeFormatted,
    calculateTimeUntil,
    preciseFormatDate,
} from '../../../utils/dates';
import Button, { ButtonSize, ButtonState } from '../../guidelines/buttons/Button';

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
    const { isLoggedIn } =
        useSelector((state: {authorization: IAuthorizationReduxState}) => state.authorization);
    const navigate = useNavigate();

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
        hasCompeted = false,
        hasPracticed = false,
        competeContestPoints = 0,
        practiceContestPoints = 0,
        maxPoints = 0,
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
                          to={`/contests/${id}/${participationType}/results/simple`}
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

    const renderContestButton = (isCompete: boolean, hasParticipated: boolean, participationPoints: number) => {
        const btnText = isCompete
            ? COMPETE_STRING
            : PRACTICE_STRING;
        const btnNavigateUrl = isCompete
            ? `/contests/${id}/compete`
            : `/contests/${id}/practice`;
        const isDisabled = isCompete
            ? !canBeCompeted
            : !canBePracticed;

        return (
            <div className={styles.contestBtn}>
                {hasParticipated && (
                <div>
                    {participationPoints}
                    {' '}
                    /
                    {' '}
                    {maxPoints}
                </div>
                )}
                <Button
                  text={btnText}
                  state={isDisabled
                      ? ButtonState.disabled
                      : ButtonState.enabled}
                  size={ButtonSize.small}
                  isCompete={isCompete}
                  onClick={() => {
                      if (!isLoggedIn) {
                          navigate('/login');
                          return;
                      }
                      navigate(btnNavigateUrl);
                  }}
                />
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
                    {renderContestButton(true, hasCompeted, competeContestPoints)}
                    {renderContestButton(false, hasPracticed, practiceContestPoints)}
                </div>
            </div>
        </div>
    );
};

export default ContestCard;
