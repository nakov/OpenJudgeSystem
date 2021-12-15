import * as React from 'react';
import { IIndexContestsType } from '../../../hooks/use-contests';
import { Button } from '../../guidelines/buttons/Button';
import Countdown from '../../guidelines/countdown/Countdown';
import { convertToSecondsRemaining } from '../../../utils/dates';
import styles from './ContestCard.module.scss';

interface IContestCardProps {
    contest: IIndexContestsType
}

const ContestCard = ({ contest }: IContestCardProps) => (
    <div className={styles.contestCard}>
        <div className={styles.contestCardHeader}>{contest.name}</div>
        <div className={styles.contestCardCategoryLabel}>{contest.category}</div>
        <div className={styles.contestCardCountdown}>
            <Countdown
              duration={convertToSecondsRemaining(new Date(contest.endTime))}
              metric="seconds"
            />
        </div>
        <div className={styles.contestCardControls}>
            <Button
              text="Compete"
              onClick={() => {
              }}
              type={
                    contest.canCompete
                        ? 'primary'
                        : 'disabled'
                }
              size="small"
            />
            <Button
              text="Practice"
              onClick={() => {
              }}
              type={
                    contest.canPractice
                        ? 'secondary'
                        : 'disabled'
                }
              size="small"
            />
        </div>
    </div>
);

export default ContestCard;
