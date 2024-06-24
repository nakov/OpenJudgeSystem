import React, { useEffect, useState } from 'react';
import { BiTransfer } from 'react-icons/bi';
import { IconButton, Tooltip } from '@mui/material';

import { TRANSFER } from '../../../../common/labels';
import { getAndSetExceptionMessage, getAndSetSuccesfullMessages } from '../../../../utils/messages-utils';
import { renderErrorMessagesAlert, renderSuccessfullAlert } from '../../../../utils/render-utils';
import ConfirmDialog from '../../../guidelines/dialog/ConfirmDialog';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';

interface ITransferParticipantsButtonProps {
    onSuccess?: () => void;
    id: number;
    name: string;
    category?: string;
    style?: object;
    mutation: any;
}

const TransferParticipantsButton = (props: ITransferParticipantsButtonProps) => {
    const { onSuccess, id, name, category, style, mutation } = props;

    const [ transfer, { data, isLoading, isSuccess, isFetching, error, reset } ] = mutation();

    const [ showConfirmTransfer, setShowConfirmTransfer ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string | null>(null);
    const [ errorMessages, setErrorMessages ] = useState<Array<string>>([]);

    const confirmTransfer = () => {
        setShowConfirmTransfer(!showConfirmTransfer);
    };

    useEffect(() => {
        const successMessage = getAndSetSuccesfullMessages([ { message: data as string, shouldGet: isSuccess } ]);
        setMessage(successMessage);
    }, [ data, isSuccess ]);

    useEffect(() => {
        getAndSetExceptionMessage([ error ], setErrorMessages);
    }, [ error ]);

    useEffect(() => {
        if (data && onSuccess) {
            reset();
            onSuccess();
        }
    }, [ data, onSuccess, reset ]);

    return (
        isLoading || isFetching
            ? <SpinningLoader />
            : (
                <div style={style
                    ? { ...style }
                    : {}}
                >
                    {renderSuccessfullAlert(message)}
                    {renderErrorMessagesAlert(errorMessages) }
                    <Tooltip title={TRANSFER}>
                        <IconButton onClick={confirmTransfer}>
                            <BiTransfer />
                        </IconButton>
                    </Tooltip>
                    { showConfirmTransfer && (
                        <ConfirmDialog
                          title="Transfer participants"
                          text={`Are you sure you want to transfer all 
                          participants from "Contest" to "Practice" for the contest 
                          "${name}"${category
                              ? ` from the category "${category}"`
                              : ''}?`}
                          confirmButtonText="Transfer"
                          declineButtonText="Cancel"
                          onClose={() => setShowConfirmTransfer(!showConfirmTransfer)}
                          confirmFunction={() => transfer(id)}
                        />
                    )}
                </div>
            )
    );
};

export default TransferParticipantsButton;
