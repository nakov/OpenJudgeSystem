import React from 'react';
import { useNavigate } from 'react-router';
import moment from 'moment';

import { IIndexContestsType } from '../../../common/types';
import useTheme from '../../../hooks/use-theme';

import styles from './ContestCard.module.scss';

interface IContestCardProps {
    contest: IIndexContestsType;
}

interface IContestButtonProps {
    isCompete: boolean;
    isDisabled: boolean;
    maxPoints: number;
    achievedPoints: number;
    hasParticipated: boolean;
    onClick: () => void;
}

const ContestButton = (props: IContestButtonProps) => {
    const { isCompete, isDisabled, maxPoints, achievedPoints, hasParticipated, onClick } = props;
    return (
        <div className={styles.contestBtnWrapper}>
            { hasParticipated && (
            <div className={styles.contestPoints}>
                {achievedPoints}
                /
                {maxPoints}
            </div>
            )}
            <button
              type="button"
              disabled={isDisabled}
              onClick={onClick}
            >
                {isCompete
                    ? 'COMPETE'
                    : 'PRACTICE'}
            </button>
        </div>
    );
};

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

    const navigate = useNavigate();

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
    } = contest;

    const { themeColors } = useTheme();

    const contestStartTime = canBeCompeted
        ? startTime
        : practiceStartTime;

    const contestEndTime = canBeCompeted
        ? endTime
        : practiceEndTime;

    const remainingTime = moment.duration(moment(contestEndTime).diff(moment(contestStartTime)));

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
              className={styles.contestDetailsFragment}
              style={{
                  color: isGreenColor
                      ? '#57B99D'
                      : '',
              }}
            >
                <i className={`${iconName}`} />
                <div style={{
                    textDecoration: hasUnderLine
                        ? 'underline'
                        : '',
                    cursor: hasUnderLine
                        ? 'pointer'
                        : '',
                }}
                >
                    {text}
                </div>
            </div>
        );
    };

    return (
        <div style={{ backgroundColor: themeColors.baseColor200, color: themeColors.textColor }} className={styles.contestCardWrapper}>
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
                <ContestButton
                  isCompete
                  isDisabled={!canBeCompeted}
                  maxPoints={0}
                  achievedPoints={0}
                  hasParticipated
                  onClick={() => {
                      if (canBeCompeted) {
                          navigate(`/contests/${id}/compete`);
                      }
                  }}
                />
                <ContestButton
                  isCompete={false}
                  isDisabled={!canBePracticed}
                  maxPoints={0}
                  achievedPoints={0}
                  hasParticipated={false}
                  onClick={() => {
                      navigate(`/contests/${id}/practice`);
                  }}
                />
            </div>
        </div>
    );
};

export default ContestCard;
