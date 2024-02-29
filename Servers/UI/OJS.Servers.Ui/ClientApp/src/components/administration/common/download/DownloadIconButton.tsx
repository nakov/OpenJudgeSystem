/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { getAndSetExceptionMessage } from '../../../../utils/messages-utils';
import { renderErrorMessagesAlert } from '../../../../utils/render-utils';
import IconSize from '../../../guidelines/icons/common/icon-sizes';
import DownloadIcon from '../../../guidelines/icons/DownloadIcon';

interface IDownloadIconButtonProps {
    mutation: any;
    onSuccess?: Function;
    onError?: Function;

    args: number;
}
const DownloadIconButton = (props: IDownloadIconButtonProps) => {
    const { mutation, onSuccess, onError, args } = props;
    const [ skip, setSkip ] = useState<boolean>(true);
    const {refetch, data, error, isSuccess } = mutation(args, { skip });
    const [ errorMessages, setErrorMessages ] = useState<Array<string>>([]);

    useEffect(() => {
        if (isSuccess && onSuccess) {
            onSuccess();
        }
    }, [ isSuccess, onSuccess ]);

    useEffect(() => {
        if (error) {
            getAndSetExceptionMessage([ error ], setErrorMessages);
            if (onError) {
                onError();
            }
        }
    }, [ error, onError ]);

    const onClick = () => {
        setSkip(false);
        refetch();
    };

    return (
        <>
            {renderErrorMessagesAlert(errorMessages)}
            <Tooltip title="Download" onClick={onClick}>
                <IconButton>
                    <DownloadIcon size={IconSize.Large} />
                </IconButton>
            </Tooltip>
        </>
    );
};
export default DownloadIconButton;
