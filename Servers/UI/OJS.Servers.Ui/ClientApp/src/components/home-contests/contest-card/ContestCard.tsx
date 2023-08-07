import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import isNil from 'lodash/isNil';

import { ContestParticipationType } from '../../../common/constants';
import { IIndexContestsType } from '../../../common/types';
import { useAppUrls } from '../../../hooks/use-app-urls';
import { useModal } from '../../../hooks/use-modal';
import concatClassNames from '../../../utils/class-names';
import { convertToSecondsRemaining, getLocalDateTimeInUTC } from '../../../utils/dates';
import { Button, ButtonSize, ButtonState, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';
import Countdown, { Metric } from '../../guidelines/countdown/Countdown';
import LockIcon from '../../guidelines/icons/LockIcon';

import styles from './ContestCard.module.scss';

interface IContestCardProps {
    contest: IIndexContestsType;
}

const ContestCard = ({ contest }: IContestCardProps) => {
    const {
        id,
        name,
        category,
        canBePracticed,
        practiceEndTime,
        canBeCompeted,
        endTime,
    } = contest;

    const contestCard = 'card-contests';
    const contestCardClassName = concatClassNames(styles.contestCard, contestCard);
    const contestCardHeader = 'card-header';
    const contestCardHeaderClassName = concatClassNames(
        styles.contestCardHeader,
        contestCardHeader,
        name.length >= 24
            ? styles.contestTitleHoverable
            : '',
    );
    const contestCardCategory = 'card-category';
    const contestCardCategoryClassName = concatClassNames(styles.contestCardCategoryLabel, contestCardCategory);
    const contestCardCounter = 'card-counter';
    const contestCardCounterClassName = concatClassNames(styles.contestCardCountdown, contestCardCounter);
    const contestCardControlBtns = 'card-control-buttons';
    const contestCardControlBtnsClassName = concatClassNames(styles.contestCardControls, contestCardControlBtns);

    const { getParticipateInContestUrl } = useAppUrls();
    const { actions: { setIsShowing } } = useModal();
    const navigate = useNavigate();

    const renderCountdown = useCallback(
        () => {
            const endDate = endTime !== null
                ? endTime
                : practiceEndTime !== null
                    ? practiceEndTime
                    : null;

            if (isNil(endDate) || new Date(endDate) < getLocalDateTimeInUTC()) {
                return null;
            }

            return (
                <Countdown
                  key={id}
                  duration={convertToSecondsRemaining(new Date(endDate))}
                  metric={Metric.seconds}
                />
            );
        },
        [ endTime, id, practiceEndTime ],
    );

    const renderContestLockIcon = useCallback(
        () => {
            const { hasContestPassword, hasPracticePassword } = contest;

            return (canBeCompeted && hasContestPassword) || (canBePracticed && hasPracticePassword)
                ? <LockIcon />
                : null;
        },
        [ canBeCompeted, canBePracticed, contest ],
    );

    const setIsShowingAndNavigateToContest = useCallback(
        () => {
            setIsShowing(true);
            navigate(getParticipateInContestUrl({
                id,
                participationType: ContestParticipationType.Compete,
            }));
        },
        [
            setIsShowing,
            navigate,
            getParticipateInContestUrl,
            id,
        ],
    );

    return (
        <div className={contestCardClassName}>
            <div className={contestCardHeaderClassName}>
                <div className={styles.tooltip}>
                    <span className={styles.tooltipText}>{name}</span>
                </div>
                <span className={styles.contestCardTitle}>{name}</span>
                { renderContestLockIcon() }
            </div>
            <div className={contestCardCategoryClassName}>{category}</div>
            <div className={contestCardCounterClassName}>
                {renderCountdown()}
            </div>
            <div className={contestCardControlBtnsClassName}>
                <Button
                  id="button-card-compete"
                  onClick={() => setIsShowingAndNavigateToContest()}
                  text="Compete"
                  state={
                        canBeCompeted
                            ? ButtonState.enabled
                            : ButtonState.disabled
                    }
                  size={ButtonSize.small}
                />
                <LinkButton
                  id="button-card-practice"
                  to={getParticipateInContestUrl({
                      id,
                      participationType: ContestParticipationType.Practice,
                  })}
                  text="Practice"
                  type={LinkButtonType.secondary}
                  state={
                        canBePracticed
                            ? ButtonState.enabled
                            : ButtonState.disabled
                    }
                  size={ButtonSize.small}
                />
            </div>
        </div>
    );
};

export default ContestCard;
