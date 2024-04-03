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
   queryParams?: IGetAllAdminParams;
}
const ExportExcel = (props:IExportExcelProps) => {
    const { mutation: lazyQuery, disabled = false, queryParams } = props;

    const [ exceptionMessages, setExceptionMessages ] = useState<Array<string>>([]);

    /* Use lazy queries because in other case everytime te queryParams changes,
    there will be call to download */
    const [ trigger, { data, error, isSuccess, isLoading, isFetching } ] = lazyQuery
        ? lazyQuery()
        : [ {}, { data: null, error: null, isSuccess: false, isLoading: false, isFetching: false } ];

    useEffect(() => {
        if (isSuccess) {
            if (data) {
                downloadFile(data.blob, data.filename);
            } else {
                setExceptionMessages([ 'The required file is empty.' ]);
            }
        }
    }, [ data, isSuccess ]);

    useEffect(() => {
        if (error) {
            getAndSetExceptionMessage([ error ], setExceptionMessages);
        }
    }, [ error ]);

    return (
        <>
            {(isLoading || isFetching) && renderInfoMessage('The request is currently in process.')}
            {renderErrorMessagesAlert(exceptionMessages)}
            <Tooltip title={disabled || isLoading || isFetching
                ? 'Action not allowed'
                : 'Export to excel'}
            >
                <span>
                    <IconButton disabled={disabled || isLoading || isFetching} onClick={() => { trigger(queryParams); }}>
                        <RiFileExcel2Fill
                          className={disabled || isLoading || isFetching
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
