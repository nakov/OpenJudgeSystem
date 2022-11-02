import React, { useCallback } from 'react';

import { IIndexContestsType } from '../../../common/types';
import concatClassNames from '../../../utils/class-names';
import { convertToSecondsRemaining } from '../../../utils/dates';
import { ButtonSize, ButtonState, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';
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
    const contestCardHeaderClassName = concatClassNames(styles.contestCardHeader, contestCardHeader);
    const contestCardCategory = 'card-category';
    const contestCardCategoryClassName = concatClassNames(styles.contestCardCategoryLabel, contestCardCategory);
    const contestCardCounter = 'card-counter';
    const contestCardCounterClassName = concatClassNames(styles.contestCardCountdown, contestCardCounter);
    const contestCardControlBtns = 'card-control-buttons';
    const contestCardControlBtnsClassName = concatClassNames(styles.contestCardControls, contestCardControlBtns);

    const renderCountdown = useCallback(
        () => {
            if (canBePracticed && practiceEndTime == null) {
                return <p>No practice end time.</p>;
            }

            const endDate = canBeCompeted && !canBePracticed
                ? endTime
                : practiceEndTime;

            return (
                <Countdown
                  key={id}
                  duration={convertToSecondsRemaining(new Date(endDate))}
                  metric={Metric.seconds}
                />
            );
        },
        [ canBeCompeted, canBePracticed, endTime, id, practiceEndTime ],
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
                <LinkButton
                  id="button-card-compete"
                  to={`/contests/${id}/register/compete`}
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
                  to={`/contests/${id}/register/practice`}
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
