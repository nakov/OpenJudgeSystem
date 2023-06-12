import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import isNil from 'lodash/isNil';

import { ContestParticipationType } from '../../common/constants';
import { IIndexContestsType } from '../../common/types';
import { useAppUrls } from '../../hooks/use-app-urls';
import Button, { ButtonSize, LinkButton } from '../guidelines/buttons/Button';

import styles from './ContestModal.module.scss';

interface IContestModalProps {
    contest: IIndexContestsType;
    openModal: boolean;
}

const ContestModal = ({ contest, openModal }: IContestModalProps) => {
    const [ open, setOpen ] = useState<boolean>(false);
    const { getParticipateInContestUrl } = useAppUrls();

    useEffect(() => setOpen(openModal), [ openModal ]);

    console.log(openModal);
    console.log(contest);
    if (isNil(contest)) {
        return null;
    }

    return (
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
                            {contest.duration}
                            {' '}
                            hours to complete the contest
                            {' '}
                            {contest.name}
                            {' '}
                            { contest.numberOfProblems}
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
                              id: contest.id,
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
    );
};

export default ContestModal;
