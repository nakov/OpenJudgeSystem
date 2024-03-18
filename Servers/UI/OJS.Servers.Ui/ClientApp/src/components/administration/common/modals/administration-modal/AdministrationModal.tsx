/* eslint-disable @typescript-eslint/ban-types */
import React, { ReactNode } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Box, IconButton, Modal } from '@mui/material';

import styles from './AdministrationModal.module.scss';

interface IAdministrationModalProps {
    index: number;
    open: boolean;
    onClose: Function;
    children: ReactNode;
}

enum ModalReasonsToClose {
EscapeKeyDown = 'escapeKeyDown',
BackDropClick = 'backdropClick'
}

const AdministrationModal = (props: IAdministrationModalProps) => {
    const { index, children, open, onClose } = props;

    const onModalClose = (event: object, reason: string) => {
        if (reason === ModalReasonsToClose.BackDropClick) {
            return;
        }
        if (onClose) {
            onClose();
        }
    };

    return (
        <Modal
          key={index}
          open={open}
          onClose={(event, reason) => onModalClose(event, reason)}
        >
            <Box className={styles.wrapper}>
                <IconButton className={styles.closeIcon} onClick={(event) => onModalClose(event, ModalReasonsToClose.EscapeKeyDown)}>
                    <IoMdClose />
                </IconButton>
                {children}
            </Box>
        </Modal>
    );
};
export default AdministrationModal;
