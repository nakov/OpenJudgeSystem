import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

import { Alert, AlertHorizontalOrientation, AlertSeverity, AlertVariant, AlertVerticalOrientation } from '../../../guidelines/alert/Alert';
import ConfirmDialog from '../../../guidelines/dialog/ConfirmDialog';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';

interface IDeleteButtonProps {
    onSuccess?: () => void;
    id: number;
    name: string;
    style?: object;
    text: string;
    mutation: any
}

const DeleteButton = (props: IDeleteButtonProps) => {
    const { onSuccess, id, name, style = {}, text, mutation } = props;
    const [ showConfirmDelete, setShowConfirmDelete ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string | null>(null);

    const [ deleteRequest, { data, isLoading, isSuccess, error } ] = mutation();

    const confirmDelete = () => {
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
                <div style={style
                    ? { ...style }
                    : {}}
                >
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
                    <IconButton onClick={confirmDelete}>
                        <DeleteIcon
                          sx={{
                              width: '1.7rem',
                              height: '2rem',
                          }}
                          color="error"
                        >
                            Delete
                        </DeleteIcon>
                    </IconButton>
                    {showConfirmDelete && (
                    <ConfirmDialog
                      title={`Delete: ${name}`}
                      text={text}
                      confirmButtonText="Delete"
                      declineButtonText="Cancel"
                      onClose={() => setShowConfirmDelete(!showConfirmDelete)}
                      confirmFunction={() => deleteRequest({ id })}
                    />
                    )}
                </div>
            )
    );
};

export default DeleteButton;
