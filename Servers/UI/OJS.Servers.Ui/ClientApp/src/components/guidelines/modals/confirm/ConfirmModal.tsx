import * as React from 'react';

import Modal from 'react-modal';
import { Button, ButtonSize, ButtonType } from '../../buttons/Button';

import styles from './ConfirmModal.module.scss';
import Heading from '../../headings/Heading';

interface IConfirmModalProps {
    title: string,
    content: string,
    isOpen: boolean,
    onConfirm: () => void,
    onCancel: () => void,
}

Modal.setAppElement('#root');

const ConfirmModal = ({ title, content, isOpen, onConfirm, onCancel }: IConfirmModalProps) => (
    <div>
        <Modal
          isOpen={isOpen}
          className={styles.modal}
          overlayClassName={styles.modalOverlay}
          shouldCloseOnEsc
          shouldCloseOnOverlayClick
        >
            <Heading type="small" className={styles.modalHeader}>
                {title}
            </Heading>
            <p className={styles.modalContent}>
                {content}
            </p>
            <div className={styles.modalFooter}>
                <Button
                  text="Yes"
                  onClick={() => onConfirm()}
                  size={ButtonSize.small}
                />
                <Button
                  text="No"
                  onClick={() => onCancel()}
                  type={ButtonType.secondary}
                  size={ButtonSize.small}
                />
            </div>
        </Modal>
    </div>
);

export default ConfirmModal;
