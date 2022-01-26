import * as React from 'react';
import { IIndexContestsType } from '../../../hooks/use-contests';
import Countdown from '../../guidelines/countdown/Countdown';
import { convertToSecondsRemaining } from '../../../utils/dates';
import styles from './ContestCard.module.scss';
import { LinkButton } from '../../guidelines/buttons/Button';

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
            <LinkButton
              to={`/contests/${contest.id}/compete`}
              text="Compete"
              type={
                  contest.canCompete
                      ? 'primary'
                      : 'disabled'
              }
              size="small"
            />
            <LinkButton
              to={`/contests/${contest.id}/practice`}
              text="Practice"
              type={
                    contest.canCompete
                        ? 'primary'
                        : 'disabled'
                }
              size="small"
            />
        </div>
    </div>
);

export default ContestCard;
