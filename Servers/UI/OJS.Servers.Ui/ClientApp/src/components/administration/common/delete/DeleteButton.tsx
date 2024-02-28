import React, { useEffect, useState } from 'react';
import { IoMdTrash } from 'react-icons/io';
import { IconButton, Tooltip } from '@mui/material';

import { DELETE } from '../../../../common/labels';
import { getAndSetExceptionMessage, getAndSetSuccesfullMessages } from '../../../../utils/messages-utils';
import { renderAlert } from '../../../../utils/render-utils';
import { AlertSeverity } from '../../../guidelines/alert/Alert';
import ConfirmDialog from '../../../guidelines/dialog/ConfirmDialog';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';

interface IDeleteButtonProps {
    onSuccess?: () => void;
    id: number;
    name: string;
    style?: object;
    text: string;
    mutation: any;
}

const DeleteButton = (props: IDeleteButtonProps) => {
    const { onSuccess, id, name, style = {}, text, mutation } = props;
    const [ showConfirmDelete, setShowConfirmDelete ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string | null>(null);
    const [ errorMessages, setErrorMessages ] = useState<Array<string>>([]);

    const [ deleteRequest, { data, isLoading, isSuccess, error } ] = mutation();
    const confirmDelete = () => {
        setShowConfirmDelete(!showConfirmDelete);
    };

    useEffect(() => {
        const successMessage = getAndSetSuccesfullMessages([ { message: data as string, shouldGet: isSuccess } ]);
        setMessage(successMessage);
    }, [ data, isSuccess ]);

    useEffect(() => {
        getAndSetExceptionMessage([ error ], setErrorMessages);
    }, [ error ]);

    useEffect(() => {
        if (isSuccess && onSuccess) {
            onSuccess();
        }
    }, [ isSuccess, onSuccess ]);

    return (
        isLoading
            ? <SpinningLoader />
            : (
                <div style={style
                    ? { ...style }
                    : {}}
                >
                    {message && renderAlert(message, AlertSeverity.Success, 0, 3000)}
                    {errorMessages.map((x: string, i:number) => renderAlert(x, AlertSeverity.Error, i))}
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
                      confirmFunction={() => deleteRequest(id)}
                    />
                    )}
                </div>
            )
    );
};

export default DeleteButton;
