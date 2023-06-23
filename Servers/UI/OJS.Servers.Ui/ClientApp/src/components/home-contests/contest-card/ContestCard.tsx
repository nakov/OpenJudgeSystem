import React, { useCallback } from 'react';
import isNil from 'lodash/isNil';

import { ContestParticipationType } from '../../../common/constants';
import { IIndexContestsType } from '../../../common/types';
import { useAppUrls } from '../../../hooks/use-app-urls';
import concatClassNames from '../../../utils/class-names';
import { convertToSecondsRemaining } from '../../../utils/dates';
import { Button, ButtonSize, ButtonState, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';
import Countdown, { Metric } from '../../guidelines/countdown/Countdown';
import LockIcon from '../../guidelines/icons/LockIcon';
import ContestModal from '../../modal/ContestModal';

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
    const { getParticipateInContestUrl } = useAppUrls();
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
            const endDate = canBeCompeted
                ? endTime
                : practiceEndTime;

            if (canBePracticed && isNil(practiceEndTime) && isNil(endDate)) {
                return <p>No practice end time.</p>;
            }

            if ((!canBePracticed && !canBeCompeted) || isNil(endDate)) {
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

    const renderModal = useCallback(
        () => {
            if (isNil(contest)) {
                return null;
            }

            return (
                <ContestModal contest={contest} openModal />
            );
        },
        [ contest ],
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
                  onClick={() => renderModal()}
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
                      problemIndex: 1,
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
