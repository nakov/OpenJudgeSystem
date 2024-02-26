import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import moment from 'moment';

import { IIndexContestsType } from '../../../common/types';
import useTheme from '../../../hooks/use-theme';
import { IAuthorizationReduxState } from '../../../redux/features/authorizationSlice';
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

    const diffTime = moment(contestEndTime).diff(moment(contestStartTime));
    const remainingTime = moment.duration(diffTime);

    const renderContestDetailsFragment = (
        iconName: string, text: string | number | undefined,
        isGreenColor?: boolean, hasUnderLine?: boolean,
    ) => {
        if (!text || !iconName) {
            return;
        }

        // eslint-disable-next-line consistent-return
        return (
            <div
              className={`${styles.contestDetailsFragment} ${isGreenColor
                  ? styles.greenColor
                  : ''}`}
            >
                <i className={`${iconName}`} />
                <div className={`${hasUnderLine
                    ? styles.hasUnderLine
                    : ''}`}
                >
                    {text}
                </div>
            </div>
        );
    };

    const renderContestButton = (isCompete: boolean, hasParticipated: boolean, participationPoints: number) => {
        const btnText = isCompete
            ? 'COMPETE'
            : 'PRACTICE';
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
                <div className={styles.contestCardTitle}>{name}</div>
                <div className={styles.contestCardSubTitle}>{category}</div>
                <div className={styles.contestDetailsFragmentsWrapper}>
                    {renderContestDetailsFragment(iconNames.time, moment(contestStartTime).format('HH:MM'))}
                    {renderContestDetailsFragment(iconNames.date, moment(contestStartTime).format('D MMM YY'))}
                    {renderContestDetailsFragment(iconNames.numberOfProblems, numberOfProblems)}
                    {renderContestDetailsFragment(iconNames.practiceResults, `practice results: ${practiceResults}`, false, true)}
                    {renderContestDetailsFragment(iconNames.competeResults, `compete results: ${competeResults}`, true, true)}
                    {canBeCompeted && remainingTime.asSeconds() > 0 && renderContestDetailsFragment(
                        iconNames.remainingTime,
                        `remaining time: ${Math.floor(remainingTime.asHours())}:${remainingTime.minutes()}:${remainingTime.seconds()}`,
                        false,
                        true,
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
