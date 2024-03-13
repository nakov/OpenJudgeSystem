import React, { useEffect, useState } from 'react';
import { IoMdTrash } from 'react-icons/io';
import { IconButton, Tooltip } from '@mui/material';

import { DELETE } from '../../../../common/labels';
import { Alert, AlertHorizontalOrientation, AlertSeverity, AlertVariant, AlertVerticalOrientation } from '../../../guidelines/alert/Alert';
import ConfirmDialog from '../../../guidelines/dialog/ConfirmDialog';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';

interface IDeleteUserFromGroupButtonProps {
    onSuccess?: () => void;
    id: string;
    examGroupId: number;
    name: string;
    style?: object;
    text: string;
    mutation: any;
}

const DeleteUserFromGroupButton = (props: IDeleteUserFromGroupButtonProps) => {
    const { onSuccess, id, examGroupId, name, style = {}, text, mutation } = props;
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
                    <Tooltip title={DELETE}>
                        <IconButton onClick={confirmDelete}>
                            <IoMdTrash color="red" />
                        </IconButton>
                    </Tooltip>
                    {showConfirmDelete && (
                        <ConfirmDialog
                          title={`Delete: ${name}`}
                          text={text}
                          confirmButtonText="Delete"
                          declineButtonText="Cancel"
                          onClose={() => setShowConfirmDelete(!showConfirmDelete)}
                          confirmFunction={() => deleteRequest({ groupId: examGroupId, userId: id })}
                        />
                    )}
                </div>
            )
    );
};

export default DeleteUserFromGroupButton;
