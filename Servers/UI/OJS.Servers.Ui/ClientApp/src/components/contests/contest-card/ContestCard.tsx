import React from 'react';
import { useNavigate } from 'react-router';
import moment from 'moment';
import styled from 'styled-components';

import { IIndexContestsType } from '../../../common/types';
import useTheme from '../../../hooks/use-theme';

import styles from './ContestCard.module.scss';

interface IContestCardProps {
    numberOfProblems?: number;
    practiceResults?: number;
    competeResults?: number;
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

const StyledDiv = styled.div`
  background-color: ${(props) => props.theme.baseColor200};
  color: ${(props) => props.theme.textColor};
`;

const ContestCard = (props: IContestCardProps) => {
    const {
        numberOfProblems,
        practiceResults,
        competeResults,
        contest,
    } = props;

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
    } = contest;

    const { themeColors } = useTheme();

    const contestStartTime = canBeCompeted
        ? startTime
        : practiceStartTime;

    const contestEndTime = canBeCompeted
        ? endTime
        : practiceEndTime;

    const remainingTime = moment.duration(moment(contestEndTime).diff(moment(contestStartTime)));

    const renderContestDetailsFragment = (iconName: string, text: string | number | undefined) => {
        if (!text || !iconName) {
            return;
        }
        // eslint-disable-next-line consistent-return
        return (
            <div className={styles.contestDetailsFragment}>
                <i className={`${iconName}`} />
                <div>{text}</div>
            </div>
        );
    };

    return (
        <StyledDiv theme={themeColors} className={styles.contestCardWrapper}>
            <div>
                <div className={styles.contestCardTitle}>{name}</div>
                <div className={styles.contestCardSubTitle}>{category}</div>
                <div className={styles.contestDetailsFragmentsWrapper}>
                    {renderContestDetailsFragment(iconNames.time, moment(contestStartTime).format('HH:MM'))}
                    {renderContestDetailsFragment(iconNames.date, moment(contestStartTime).format('D MMM YY'))}
                    {renderContestDetailsFragment(iconNames.numberOfProblems, numberOfProblems)}
                    {practiceResults && renderContestDetailsFragment(iconNames.practiceResults, `practice results: ${practiceResults}`)}
                    {competeResults && renderContestDetailsFragment(iconNames.competeResults, `compete results: ${competeResults}`)}
                    {canBeCompeted && remainingTime.asSeconds() > 0 && renderContestDetailsFragment(
                        iconNames.remainingTime,
                        `remaining time: ${Math.floor(remainingTime.asHours())}:${remainingTime.minutes()}:${remainingTime.seconds()}`,
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
        </StyledDiv>
    );
};

export default ContestCard;
