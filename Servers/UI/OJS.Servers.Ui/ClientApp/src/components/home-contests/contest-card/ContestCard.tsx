import * as React from 'react';
import { IIndexContestsType } from '../../../hooks/contests/use-contests';
import Countdown from '../../guidelines/countdown/Countdown';
import { convertToSecondsRemaining } from '../../../utils/dates';
import styles from './ContestCard.module.scss';
import { LinkButton } from '../../guidelines/buttons/Button';

interface IContestCardProps {
    contest: IIndexContestsType
}

const ContestCard = ({ contest }: IContestCardProps) => {
    const renderCountdown = () => {
        if (contest.canBePracticed && contest.practiceEndTime == null) {
            return <p>No practice end time.</p>;
        }

        const timeToRender = contest.canBeCompeted && !contest.canBePracticed
        // render compete time
            ? contest.endTime
            : contest.practiceEndTime;

        // console.log(contest.id);
        // console.log(timeToRender);
        // console.log(convertToSecondsRemaining(new Date(timeToRender)));

        return (
            <Countdown
              key={contest.id}
              duration={convertToSecondsRemaining(new Date(timeToRender))}
              metric="seconds"
            />
        );
    };

    return (
        <div className={styles.contestCard}>
            <div className={styles.contestCardHeader}>{contest.name}</div>
            <div className={styles.contestCardCategoryLabel}>{contest.category}</div>
            <div className={styles.contestCardCountdown}>
                {renderCountdown()}
            </div>
            <div className={styles.contestCardControls}>
                <LinkButton
                  id="button-card-compete"
                  to={`/contests/${contest.id}/compete`}
                  text="Compete"
                  type={
                        contest.canBeCompeted
                            ? 'primary'
                            : 'disabled'
                    }
                  size="small"
                />
                <LinkButton
                  id="button-card-practice"
                  to={`/contests/${contest.id}/practice`}
                  text="Practice"
                  type={
                        contest.canBePracticed
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
