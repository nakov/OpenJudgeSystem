/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box, FormControl, FormLabel,
    TextareaAutosize,
    TextField,
} from '@mui/material';
import isNil from 'lodash/isNil';
import { parse } from 'node:url';

import { ISubmissionForProcessingAdminGridViewType } from '../../../common/types';
import { useGetByIdQuery } from '../../../redux/services/admin/submissionsForProcessingAdminService';
import { preciseFormatDate } from '../../../utils/dates';

import styles from './AdminSubmissionForProcessingDetails.module.scss';

const AdministrationContestPage = () => {
    const { pathname } = useLocation();
    const [ , , , contestId ] = pathname.split('/');
    const [ submission, setSubmission ] = useState<ISubmissionForProcessingAdminGridViewType | null>(null);

    const { data } = useGetByIdQuery(
        { id: Number(contestId) },
        { skip: isNil(contestId) },
    );

    useEffect(
        () => {
            if (data) {
                console.log(data);
                setSubmission(data);
                console.log(JSON.stringify(data.serializedExecutionDetails, null, 2));
            }
        },
        [ data ],
    );

    return (
        !isNil(submission)
            ? (
                <Box className={`${styles.fieldBox}`}>
                    <TextField
                      className={styles.inputRow}
                      label="ID"
                      variant="standard"
                      value={submission.id}
                      disabled
                    />
                    <TextField
                      className={styles.inputRow}
                      label="Submission ID"
                      variant="standard"
                      value={submission.submissionId}
                      disabled
                    />
                    <TextField
                      className={styles.inputRow}
                      label="Is Processed"
                      variant="standard"
                      value={submission.processed}
                      disabled
                    />
                    <TextField
                      className={styles.inputRow}
                      label="Is Processing"
                      variant="standard"
                      value={submission.processing}
                      disabled
                    />
                    <TextField
                      className={styles.inputRow}
                      label="Serialized Exception"
                      variant="standard"
                      value={submission.serializedException ?? 'No value'}
                      disabled
                    />
                    <FormControl sx={{ width: '60%' }}>
                        <FormLabel>Serialized Execution Details</FormLabel>
                        <TextareaAutosize
                          minRows={10}
                          value={JSON.stringify(submission.serializedExecutionDetails, null, 2) ?? 'No value'}
                        />
                    </FormControl>
                    <FormControl sx={{ width: '60%' }}>
                        <FormLabel>Serialized Execution Result</FormLabel>
                        <TextareaAutosize
                          minRows={10}
                          value={submission.serializedExecutionResult ?? 'No value'}
                          name="serializedExecutionResult"
                          disabled
                        />
                    </FormControl>
                    <TextField
                      className={styles.inputRow}
                      label="Created On"
                      variant="standard"
                      value={preciseFormatDate(submission.createdOn)}
                      disabled
                    />
                    <TextField
                      className={styles.inputRow}
                      label="Modified On"
                      variant="standard"
                      value={preciseFormatDate(submission.modifiedOn)}
                      disabled
                    />
                </Box>
            )
            : null
    );
};
export default AdministrationContestPage;
