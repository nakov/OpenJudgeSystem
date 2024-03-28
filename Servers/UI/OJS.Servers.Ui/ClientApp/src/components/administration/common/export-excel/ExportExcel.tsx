import { useEffect, useState } from 'react';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { IconButton, Tooltip } from '@mui/material';

import { IGetAllAdminParams } from '../../../../common/types';
import concatClassNames from '../../../../utils/class-names';
import downloadFile from '../../../../utils/file-download-utils';
import { getAndSetExceptionMessage } from '../../../../utils/messages-utils';
import { renderErrorMessagesAlert, renderInfoMessage } from '../../../../utils/render-utils';

import styles from './ExportExcel.module.scss';

interface IExportExcelProps{
   mutation?: any;
   disabled?: boolean;
   queryParams: IGetAllAdminParams;
}
const ExportExcel = (props:IExportExcelProps) => {
    const { mutation, disabled = false, queryParams } = props;

    const [ skip, setSkip ] = useState<boolean>(true);

    const [ exceptionMessages, setExceptionMessages ] = useState<Array<string>>([]);

    const { refetch, data, error, isSuccess, isLoading, isFetching } = mutation
        ? mutation(queryParams, { skip })
        : { data: null, error: null, isSuccess: false, refetch: null, isLoading: false, isFetching: false };

    useEffect(() => {
        if (isSuccess && !skip) {
            if (data) {
                downloadFile(data.blob, data.filename);
            } else {
                setExceptionMessages([ 'The required file is empty.' ]);
            }
        }
    }, [ data, isSuccess, skip ]);

    useEffect(() => {
        if (error) {
            getAndSetExceptionMessage([ error ], setExceptionMessages);
        }
    }, [ error ]);

    useEffect(() => {
        if (!skip) {
            refetch();
        }
    }, [ refetch, skip ]);

    const onClick = () => {
        if (skip) {
            setSkip(false);
        } else {
            refetch();
        }
    };

    return (
        <>
            {(isLoading || isFetching) && renderInfoMessage('The request is currently in process.')}
            {renderErrorMessagesAlert(exceptionMessages)}
            <Tooltip title={disabled
                ? 'Action not allowed'
                : 'Export to excel'}
            >
                <span>
                    <IconButton disabled={disabled} onClick={onClick}>
                        <RiFileExcel2Fill
                          className={disabled
                              ? concatClassNames(styles.size, styles.disabledColor)
                              : concatClassNames(styles.size, styles.activeColor)}
                        />
                    </IconButton>
                </span>
            </Tooltip>
        </>
    );
};

export default ExportExcel;
