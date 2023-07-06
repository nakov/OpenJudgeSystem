import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import { ContestParticipationType } from '../../common/constants';
import { IContestModal } from '../../common/types';
import { useAppUrls } from '../../hooks/use-app-urls';
import { useCurrentContest } from '../../hooks/use-current-contest';
import Button, { ButtonSize, ButtonType } from '../guidelines/buttons/Button';

import styles from './ContestModal.module.scss';

interface IContestModalProps {
    contest: IContestModal;
    isShowing: boolean;
    toggle: () => void;
}

const ContestModal = ({ contest, isShowing, toggle }: IContestModalProps) => {
    const { getParticipateInContestUrl } = useAppUrls();
    const navigate = useNavigate();
    const { actions: { setIsUserParticipant } } = useCurrentContest();

    const startContestAndHideModal = useCallback(
        () => {
            setIsUserParticipant(true);

            navigate(getParticipateInContestUrl({
                id: contest.id,
                participationType: ContestParticipationType.Compete,
                problemIndex: 1,
            }));

            toggle();
        },
        [ contest, getParticipateInContestUrl, navigate, toggle, setIsUserParticipant ],
    );

    return isShowing
        ? (
            <div>
                <Modal
                  open={isShowing}
                  sx={{ '& .MuiBackdrop-root': { backgroundColor: 'transparent' }, backdropFilter: 'blur(5px)' }}
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
                                <span className={styles.bolded}>{contest.name}</span>
                                .
                            </>
                        </Typography>
                        <Typography id="modal-modal-description">
                            Your time will start counting down when you press the &quot;Compete&quot; button.
                            <br />
                            <br />
                            In the case of unexpected problems (turning off your computer, exiting the page/system,
                            internet connection failure),
                            {' '}
                            <span className={styles.bolded}>the time lost will not be restored</span>
                            . When time runs out,
                            you
                            {' '}
                            <span className={styles.bolded}>will not</span>
                            {' '}
                            be able to compete in this competition again.
                            <br />
                            <br />
                            When you click the &quot;Compete&quot; button,
                            {' '}
                            <span className={styles.bolded}>
                                {contest.numberOfProblems}
                                {' '}
                                random problems, one of each type, will be generated
                            </span>
                            {' '}
                            for you.
                            <br />
                            <br />
                            <span className={styles.italicized}>Are you sure you want to start the contest now?</span>
                        </Typography>
                        <div className={styles.buttons}>
                            <Button
                              id="button-card-compete"
                              onClick={() => startContestAndHideModal()}
                              text="Compete"
                              size={ButtonSize.small}
                            />
                            <Button onClick={() => toggle()} size={ButtonSize.small} type={ButtonType.secondary}>Cancel</Button>
                        </div>
                    </Box>
                </Modal>
            </div>
        )
        : null;
};

export default ContestModal;
