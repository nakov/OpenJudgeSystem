/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { getAndSetExceptionMessage } from '../../../../utils/messages-utils';
import { renderAlert } from '../../../../utils/render-utils';
import { AlertSeverity } from '../../../guidelines/alert/Alert';
import IconSize from '../../../guidelines/icons/common/icon-sizes';
import DownloadIcon from '../../../guidelines/icons/DownloadIcon';

interface IDownloadIconButtonProps {
    mutation: any;
    onSuccess?: Function;
    onError?: Function;

    // For different mutation there can be different arguments
    args: any;
}
const DownloadIconButton = (props: IDownloadIconButtonProps) => {
    const { mutation, onSuccess, onError, args } = props;
    const [ download, { data, error, isSuccess } ] = mutation(args);
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

    return (
        <>
            {errorMessages.map((x, i) => renderAlert(x, AlertSeverity.Error, i, 0))}
            <Tooltip title="Download" onClick={download}>
                <IconButton>
                    <DownloadIcon size={IconSize.Large} />
                </IconButton>
            </Tooltip>
        </>
    );
};
export default DownloadIconButton;
