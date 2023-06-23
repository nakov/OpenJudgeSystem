import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import { ContestParticipationType } from '../../common/constants';
import { IIndexContestsType } from '../../common/types';
import { useAppUrls } from '../../hooks/use-app-urls';
import Button, { ButtonSize } from '../guidelines/buttons/Button';

import styles from './ContestModal.module.scss';

interface IContestModalProps {
    contest: IIndexContestsType;
    isShowing: boolean;
    toggle: () => void;
}

const ContestModal = ({ contest, isShowing, toggle }: IContestModalProps) => {
    const { getParticipateInContestUrl } = useAppUrls();
    const navigate = useNavigate();

    const startContestAndHideModal = useCallback(
        () => {
            navigate(getParticipateInContestUrl({
                id: contest.id,
                participationType: ContestParticipationType.Compete,
                problemIndex: 1,
            }));

            toggle();
        },
        [ contest, getParticipateInContestUrl, navigate, toggle ],
    );

    return isShowing
        ? (
            <div>
                <Modal
                  open={isShowing}
                  onClose={() => toggle()}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                    <Box className={styles.modal}>
                        <Typography id="modal-modal-title" variant="h6" className={styles.modalHeading}>
                            <>
                                Starting now you will have
                                {' '}
                                {contest.duration}
                                {' '}
                                hours to complete the contest
                                {' '}
                                {contest.name}
                                {' '}
                                {contest.numberOfProblems}
                                .
                            </>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula?
                        </Typography>
                        <div>
                            <Button
                              id="button-card-compete"
                              onClick={() => startContestAndHideModal()}
                              text="Compete"
                              size={ButtonSize.small}
                            />
                            <Button onClick={() => toggle()} size={ButtonSize.small}>Cancel</Button>
                        </div>
                    </Box>
                </Modal>
            </div>
        )
        : null;
};

export default ContestModal;
