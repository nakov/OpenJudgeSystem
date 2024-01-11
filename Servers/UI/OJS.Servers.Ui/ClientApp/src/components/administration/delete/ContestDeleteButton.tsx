// eslint-disable-next-line import/no-unused-modules
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

import { useDeleteContestMutation } from '../../../redux/services/admin/contestsAdminService';
import { Alert, AlertHorizontalOrientation, AlertSeverity, AlertVariant, AlertVerticalOrientation } from '../../guidelines/alert/Alert';
import ConfirmDialog from '../../guidelines/dialog/ConfirmDialog';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';

import styles from './ContestDeleteButton.module.scss';

interface IContestDeleteButtonProps {
onSuccess?: () => void;
contestId: number;
contestName: string;

}

const ContestDeleteButton = (props:IContestDeleteButtonProps) => {
    const { onSuccess, contestId, contestName } = props;
    const [ deleteContest, { data, isLoading, isSuccess, error } ] = useDeleteContestMutation();
    const [ showConfirmDelete, setShowConfirmDelete ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string | null>(null);
    const confirmDeleteContest = () => {
        setShowConfirmDelete(!showConfirmDelete);
    };

    useEffect(() => {
        if (error && !isSuccess) {
            // The data by default is of type unknown
            setMessage(error.data as string);
        } else if (isSuccess) {
            setMessage(data as string);
            if (onSuccess) {
                onSuccess();
            }
        } else {
            setMessage(null);
        }
    }, [ data, error, isSuccess, onSuccess ]);

    return (
        isLoading
            ? <SpinningLoader />
            : (
                <>
                    { message && (
                    <Alert
                      variant={AlertVariant.Filled}
                      vertical={AlertVerticalOrientation.Top}
                      horizontal={AlertHorizontalOrientation.Right}
                      severity={error
                          ? AlertSeverity.Error
                          : AlertSeverity.Success}
                      message={message}
                    />
                    )}
                    <IconButton onClick={confirmDeleteContest}>
                        <DeleteIcon className={styles.button} color="error">Delete</DeleteIcon>
                    </IconButton>
                    {showConfirmDelete && (
                    <ConfirmDialog
                      title={`Delete: ${contestName}`}
                      text="Are you sure that you want to delete the contest."
                      confirmButtonText="Delete"
                      declineButtonText="Cancel"
                      onClose={() => setShowConfirmDelete(!showConfirmDelete)}
                      confirmFunction={() => deleteContest({ id: Number(contestId) })}
                    />
                    )}
                </>
            )
    );
};
export default ContestDeleteButton;
