import * as React from 'react';
import { useCallback } from 'react';
import Countdown from '../../guidelines/countdown/Countdown';
import { convertToSecondsRemaining } from '../../../utils/dates';
import { IIndexContestsType } from '../../../common/types';
import concatClassNames from '../../../utils/class-names';

import styles from './ContestCard.module.scss';
import { ButtonSize, ButtonState, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';

interface IContestCardProps {
    contest: IIndexContestsType
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
                  metric="seconds"
                />
            );
        },
        [ canBeCompeted, canBePracticed, endTime, id, practiceEndTime ],
    );

    return (
        <div className={contestCardClassName}>
            <div className={contestCardHeaderClassName}>{name}</div>
            <div className={contestCardCategoryClassName}>{category}</div>
            <div className={contestCardCounterClassName}>
                {renderCountdown()}
            </div>
            <div className={contestCardControlBtnsClassName}>
                <LinkButton
                  id="button-card-compete"
                  to={`/contests/${id}/compete`}
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
                  to={`/contests/${id}/practice`}
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
