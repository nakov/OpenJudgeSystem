import * as React from 'react';
import { IIndexContestsType } from '../../../hooks/contests/use-contests';
import Countdown from '../../guidelines/countdown/Countdown';
import { convertToSecondsRemaining } from '../../../utils/dates';
import styles from './ContestCard.module.scss';
import { LinkButton } from '../../guidelines/buttons/Button';
import concatClassNames from '../../../utils/class-names';

interface IContestCardProps {
    contest: IIndexContestsType
}

const ContestCard = ({ contest }: IContestCardProps) => {
    const cardsContests = 'all-cards-contests';
    const cardContestsClassName = concatClassNames(styles.contestCard, cardsContests);
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
        <div className={cardContestsClassName}>
            <div className={styles.contestCardHeader}>{contest.name}</div>
            <div className={styles.contestCardCategoryLabel}>{contest.category}</div>
            <div className={styles.contestCardCountdown}>
                {renderCountdown()}
            </div>
            <div className={styles.contestCardControls}>
                <LinkButton
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
