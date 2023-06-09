import React, { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import { ContestParticipationType } from '../../../common/constants';
import { IIndexContestsType } from '../../../common/types';
import { useAppUrls } from '../../../hooks/use-app-urls';
import concatClassNames from '../../../utils/class-names';
import { convertToSecondsRemaining } from '../../../utils/dates';
import Button, { ButtonSize, ButtonState, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';
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
        duration,
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
    const [ open, setOpen ] = useState(false);
    const { getParticipateInContestUrl } = useAppUrls();

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

    const renderModal = useCallback(
        () => (
            <div>
                <Modal
                  open={open}
                  onClose={() => setOpen(false)}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                    <Box className={styles.modal}>
                        <Typography id="modal-modal-title" variant="h6" className={styles.modalHeading}>
                            <>
                                Starting now you will have
                                {' '}
                                {duration}
                                {' '}
                                hours to complete the contest
                                {' '}
                                {name}
                                .
                            </>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula?
                        </Typography>
                        <div>
                            <LinkButton
                              id="button-card-compete"
                              to={getParticipateInContestUrl({
                                  id,
                                  participationType: ContestParticipationType.Compete,
                                  problemIndex: 1,
                              })}
                              text="Compete"
                              size={ButtonSize.small}
                            />
                            <Button onClick={() => setOpen(false)} size={ButtonSize.small}>Cancel</Button>
                        </div>
                    </Box>
                </Modal>
            </div>
        ),
        [ getParticipateInContestUrl, id, name, open, duration ],
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
                  onClick={() => setOpen(true)}
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
                {renderModal()}
            </div>
        </div>
    );
};

export default ContestCard;
