import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import SpinningLoader from 'src/components/guidelines/spinning-loader/SpinningLoader';
import { useGetAccessLogByIdQuery } from 'src/redux/services/admin/accessLogsAdminService';

// eslint-disable-next-line css-modules/no-unused-class
import formStyles from '../../../components/administration/common/styles/FormStyles.module.scss';

interface IAdministrationAccessLogViewPageProps {
    accessLogId: number | undefined;
}

const AdministrationAccessLogViewPage = ({ accessLogId }: IAdministrationAccessLogViewPageProps) => {
    const {
        data: accessLogData,
        isLoading: isDataLoading,
        isFetching: isDataFetching,
    } = useGetAccessLogByIdQuery(Number(accessLogId), { skip: accessLogId === undefined });

    if (isDataLoading || isDataFetching) {
        return <SpinningLoader />;
    }

    if (!accessLogData) {
        return (
            <Typography variant="h6" className={formStyles.centralize} color="error">
                No Access Log Data Found
            </Typography>
        );
    }

    return (
        <Box className={formStyles.form}>
            <Typography variant="h4" className={formStyles.centralize}>
                Access Log Details
            </Typography>
            <Box className={formStyles.fieldBox}>
                <TextField
                  label="User ID"
                  value={accessLogData.userId}
                  disabled
                  fullWidth
                  variant="outlined"
                  className={formStyles.inputRow}
                />
                <TextField
                  label="IP Address"
                  value={accessLogData.ipAddress}
                  disabled
                  fullWidth
                  variant="outlined"
                  className={formStyles.inputRow}
                />
                <TextField
                  label="Request Type"
                  value={accessLogData.requestType}
                  disabled
                  fullWidth
                  variant="outlined"
                  className={formStyles.inputRow}
                />
                <TextField
                  label="URL"
                  value={accessLogData.url}
                  disabled
                  fullWidth
                  variant="outlined"
                  className={formStyles.inputRow}
                />
                <TextField
                  label="Post Params"
                  value={accessLogData.postParams}
                  disabled
                  multiline
                  fullWidth
                  variant="outlined"
                  className={formStyles.inputRow}
                />
            </Box>
        </Box>
    );
};

export default AdministrationAccessLogViewPage;
