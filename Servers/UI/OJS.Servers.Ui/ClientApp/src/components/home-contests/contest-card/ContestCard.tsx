import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { IIndexContestsType } from '../../../hooks/contests/types';
import Countdown from '../../guidelines/countdown/Countdown';
import { convertToSecondsRemaining } from '../../../utils/dates';
import styles from './ContestCard.module.scss';
import { LinkButton } from '../../guidelines/buttons/Button';

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
    } = useMemo(
        () => contest,
        [ contest ],
    );

    const renderCountdown = useCallback(
        () => {
            if (canBePracticed && practiceEndTime == null) {
                return <p>No practice end time.</p>;
            }

            const endDate = canBeCompeted && !canBePracticed
                ? endTime
                : practiceEndTime;
            console.log(endDate);
            console.log(new Date(endDate));

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
        <div id="contest-card" className={styles.contestCard}>
            <div className={styles.contestCardHeader}>{name}</div>
            <div className={styles.contestCardCategoryLabel}>{category}</div>
            <div className={styles.contestCardCountdown}>
                {renderCountdown()}
            </div>
            <div className={styles.contestCardControls}>
                <LinkButton
                  id="button-card-compete"
                  to={`/contests/${id}/compete`}
                  text="Compete"
                  type={
                        canBeCompeted
                            ? 'primary'
                            : 'disabled'
                    }
                  size="small"
                />
                <LinkButton
                  id="button-card-practice"
                  to={`/contests/${id}/practice`}
                  text="Practice"
                  type={
                        canBePracticed
                            ? 'secondary'
                            : 'disabled'
                    }
                  size="small"
                />
            </div>
        </div>
    );
};

export default ContestCard;
