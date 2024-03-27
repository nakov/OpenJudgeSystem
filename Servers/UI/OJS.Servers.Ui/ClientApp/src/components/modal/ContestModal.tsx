import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';

import { IContestModalInfoType } from '../../common/types';
import { useCurrentContest } from '../../hooks/use-current-contest';
import { getHomePageUrl } from '../../utils/urls';
import Button, { ButtonSize, ButtonType } from '../guidelines/buttons/Button';

import styles from './ContestModal.module.scss';

interface IContestModalProps {
    contest: IContestModalInfoType;
    showModal: boolean;
}

const defaultState = { state: { isShowing: false } };

const ContestModal = ({ contest, showModal }: IContestModalProps) => {
    const [ isShowing, setIsShowing ] = useState<boolean>(defaultState.state.isShowing);
    const navigate = useNavigate();
    const { actions: { setUserHasConfirmedModal } } = useCurrentContest();

    useEffect(
        () => {
            if (showModal) {
                setIsShowing(true);
            }
        },
        [ showModal ],
    );

    const startContestAndHideModal = useCallback(
        () => {
            setUserHasConfirmedModal(true);
            setIsShowing(false);
        },
        [ setUserHasConfirmedModal ],
    );

    const toggleAndRedirectToHomePage = useCallback(
        () => {
            setIsShowing(false);
            navigate(getHomePageUrl());
        },
        [ navigate ],
    );

    return isShowing
        ? (
            <div>
                <Modal
                  open={isShowing}
                  onClose={() => toggleAndRedirectToHomePage()}
                >
                    <div className={styles.modal}>
                        <span className={styles.modalHeading}>
                            <p className={styles.headingText}>
                                Starting now
                                {' '}
                                <span className={styles.boldedText}>
                                    {' '}
                                    you will have
                                    {' '}
                                    {contest.duration?.toString().substring(0, 5)}
                                    {' '}
                                    hours
                                    {' '}
                                </span>
                                {' '}
                                to complete the contest
                                {' '}
                                <span className={styles.boldedText}>{contest.name}</span>
                                .
                            </p>
                        </span>
                        <span className={styles.bodyTextSpacing}>
                            <span className={styles.bodyText}>
                                Your time will start counting down when you press the &quot;Compete&quot; button.
                                <br />
                                <br />
                                In the case of unexpected problems (turning off your computer, exiting the page/system,
                                internet connection failure),
                                {' '}
                                <span className={styles.boldedText}>the time lost will not be restored</span>
                                . When time runs out,
                                you
                                {' '}
                                <span className={styles.boldedText}>will not</span>
                                {' '}
                                be able to compete in this competition again.
                                <br />
                                <br />
                                When you click the &quot;Compete&quot; button,
                                {' '}
                                <span className={styles.boldedText}>
                                    {contest.numberOfProblems}
                                    {' '}
                                    random problems, one of each type, will be generated
                                </span>
                                {' '}
                                for you.
                                <br />
                                <br />
                                <span className={styles.questionText}>Are you sure you want to start the contest now?</span>
                            </span>
                        </span>
                        <div className={styles.horizontalLine} />
                        <span className={styles.buttons}>
                            <Button
                              id="button-card-compete"
                              onClick={() => startContestAndHideModal()}
                              text="Compete"
                              size={ButtonSize.large}
                            />
                            <Button
                              onClick={() => toggleAndRedirectToHomePage()}
                              size={ButtonSize.large}
                              type={ButtonType.secondary}
                            >
                                Cancel
                            </Button>
                        </span>
                    </div>
                </Modal>
            </div>
        )
        : null;
};

export default ContestModal;
