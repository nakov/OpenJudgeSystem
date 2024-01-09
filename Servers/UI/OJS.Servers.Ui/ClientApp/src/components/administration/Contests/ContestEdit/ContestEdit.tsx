/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Select, TextareaAutosize, TextField, Typography } from '@mui/material';
// eslint-disable-next-line no-restricted-imports
import { isNaN } from 'lodash';

import { ContestVariation } from '../../../../common/contest-types';
import { IContestAdministration } from '../../../../common/types';
import { useDeleteContestMutation, useGetContestByIdQuery, useUpdateContestMutation } from '../../../../redux/services/admin/contestsAdminService';
import { Alert, AlertHorizontalOrientation, AlertSeverity, AlertVariant, AlertVerticalOrientation } from '../../../guidelines/alert/Alert';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';

// eslint-disable-next-line import/no-unresolved
import styles from './ContestEdit.module.scss';

interface IContestEditProps {
    contestId: number;
}

const ContestEdit = (props:IContestEditProps) => {
    const { contestId } = props;

    const { data, isFetching, isLoading } = useGetContestByIdQuery({ id: Number(contestId) });
    const [ errorMessage, setErrorMessage ] = useState<string| null>(null);
    const [ updateContest, { isLoading: isUpdating, isSuccess: isSuccesfullyUpdated, error: updateError } ] = useUpdateContestMutation();
    const navigate = useNavigate();

    const [ contest, setContest ] = useState<IContestAdministration>({
        allowedIps: '',
        allowParallelSubmissionsInTasks: false,
        autoChangeTestsFeedbackVisibility: false,
        categoryId: 0,
        categoryName: '',
        contestPassword: '',
        description: null,
        endTime: '',
        name: '',
        id: 0,
        isVisible: false,
        limitBetweenSubmissions: 0,
        newIpPassword: '',
        orderBy: 0,
        practiceEndTime: '',
        practicePassword: '',
        practiceStartTime: '',
        startTime: '',
        type: 'Exercise',
    });
    const [ deleteContest, { isLoading: isDeleting, isSuccess, error } ] = useDeleteContestMutation();
    useEffect(
        () => {
            if (data) {
                setContest(data);
            }
        },
        [ data ],
    );

    useEffect(() => {
        if (error && !isSuccess) {
            // The data by default is of type unknown
            setErrorMessage(error.data);
        } else if (updateError && !isSuccess) {
            // The data by default is of type unknown
            setErrorMessage(updateError.data);
        } else {
            setErrorMessage(null);
        }
    }, [ error, updateError ]);

    const onChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox'
            ? checked
            : value;

        setContest((prevContest) => ({
            ...prevContest,
            [name]: newValue,
        }));
    };

    const confirmDeleteContest = () => {
        deleteContest({ id: Number(contestId) });
    };

    const edit = () => updateContest(contest);

    useEffect(() => {
        if (isSuccess) {
            navigate('/administration-new/contests');
        }
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    };

    return (
        isFetching || isLoading || isDeleting
            ? <SpinningLoader />
            : (
                <div className={`${styles.flex}`}>
                    { errorMessage && (
                    <Alert
                      variant={AlertVariant.Filled}
                      vertical={AlertVerticalOrientation.Top}
                      horizontal={AlertHorizontalOrientation.Right}
                      severity={AlertSeverity.Error}
                      message={errorMessage}
                    />
                    )}
                    <Typography className={styles.centralize} variant="h4">
                        {contest.name}
                    </Typography>
                    <form className={`${styles.form}`}>
                        <Box className={`${styles.fieldBox}`}>
                            <Box>
                                <TextField
                                  className={styles.inputRow}
                                  label="Contest Id"
                                  variant="standard"
                                  value={contest.id}
                                  disabled
                                />
                                <TextField
                                  className={styles.inputRow}
                                  label="Name"
                                  variant="standard"
                                  name="name"
                                  onChange={(e) => onChange(e)}
                                  value={contest.name}
                                />
                                <FormControl
                                  className={styles.inputRow}
                                >
                                    <InputLabel id="contest-type">Type</InputLabel>
                                    <Select
                                      variant="standard"
                                      value={contest.type}
                                      className={styles.inputRow}
                                      name="type"
                                      labelId="contest-type"
                                      onChange={(e) => onChange(e)}
                                    >
                                        {Object.keys(ContestVariation).filter((key) => isNaN(Number(key))).map((key) => (
                                            <MenuItem key={key} value={key}>
                                                {key}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                  className={styles.inputRow}
                                  label="Category Name"
                                  variant="standard"
                                  value={contest.categoryName}
                                  name="categoryName"
                                  onChange={(e) => onChange(e)}
                                  multiline
                                  type="text"
                                />
                                <TextField
                                  className={styles.inputRow}
                                  type="number"
                                  name="limitBetweenSubmissions"
                                  label="Limit between submissions"
                                  variant="standard"
                                  onChange={(e) => onChange(e)}
                                  value={contest.limitBetweenSubmissions}
                                  InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                            <Box>
                                <TextField
                                  className={styles.inputRow}
                                  type="text"
                                  label="Contest Password"
                                  variant="standard"
                                  value={contest.contestPassword}
                                  name="contestPassword"
                                  onChange={(e) => onChange(e)}
                                  InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                  className={styles.inputRow}
                                  type="text"
                                  label="Practice Password"
                                  variant="standard"
                                  name="practicePassword"
                                  onChange={(e) => onChange(e)}
                                  value={contest.practicePassword || ''}
                                  InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                  className={styles.inputRow}
                                  label="New Ip password"
                                  variant="standard"
                                  value={contest.newIpPassword || ''}
                                  name="newIpPassword"
                                  onChange={(e) => onChange(e)}
                                  type="text"
                                />
                                <TextField
                                  className={styles.inputRow}
                                  type="number"
                                  label="Order By"
                                  variant="standard"
                                  value={contest.orderBy}
                                  onChange={(e) => onChange(e)}
                                  InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                  className={styles.inputRow}
                                  type="text"
                                  label="Allowed Ips"
                                  variant="standard"
                                  value={contest.allowedIps}
                                  onChange={(e) => onChange(e)}
                                  InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                        </Box>
                        <FormControl className={styles.textArea}>
                            <FormLabel>Description</FormLabel>
                            <TextareaAutosize
                              placeholder="Enter description here..."
                              value={contest.description === null
                                  ? ''
                                  : contest.description}
                              minRows={10}
                              name="description"
                              onChange={(e) => onChange(e)}
                            />
                        </FormControl>
                        <div className={styles.row}>
                            <TextField
                              className={styles.inputRow}
                              label="Start Time"
                              variant="standard"
                              type="date"
                              onChange={(e) => onChange(e)}
                              name="startTime"
                              value={contest.startTime
                                  ? formatDate(contest.startTime)
                                  : ''}
                              InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                              style={{ marginLeft: '30px' }}
                              className={styles.inputRow}
                              label="End Time"
                              variant="standard"
                              type="date"
                              name="endTime"
                              onChange={(e) => onChange(e)}
                              value={contest.endTime
                                  ? formatDate(contest.endTime)
                                  : ''}
                              InputLabelProps={{ shrink: true }}
                            />
                        </div>
                        <div className={styles.row}>
                            <TextField
                              className={styles.inputRow}
                              label="Practice Start Time"
                              variant="standard"
                              type="date"
                              name="practiceStartTime"
                              onChange={(e) => onChange(e)}
                              value={contest.practiceStartTime
                                  ? formatDate(contest.practiceStartTime)
                                  : ''}
                              InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                              style={{ marginLeft: '30px' }}
                              className={styles.inputRow}
                              label="Practice End Time"
                              variant="standard"
                              type="date"
                              name="practiceEndTime"
                              onChange={(e) => onChange(e)}
                              value={contest.practiceEndTime
                                  ? formatDate(contest.practiceEndTime)
                                  : ''}
                              InputLabelProps={{ shrink: true }}
                            />
                        </div>
                        <Box className={styles.flex}>
                            <FormControlLabel
                              control={<Checkbox checked={contest.isVisible} />}
                              label="IsVisible"
                              name="isVisible"
                              onChange={(e) => onChange(e)}
                            />
                            <FormControlLabel
                              control={(
                                  <Checkbox
                                    checked={contest.allowParallelSubmissionsInTasks}
                                  />
                              )}
                              name="allowParallelSubmissionsInTasks"
                              onChange={(e) => onChange(e)}
                              label="Allow parallel submissions in tasks"
                            />
                            <FormControlLabel
                              control={(
                                  <Checkbox
                                    checked={contest?.autoChangeTestsFeedbackVisibility}
                                  />
                                )}
                              name="autoChangeTestsFeedbackVisibility"
                              onChange={(e) => onChange(e)}
                              label="Auto change tests feedback visibility"
                            />
                        </Box>
                    </form>
                    <div className={styles.buttonsWrapper}>
                        <Button variant="contained" onClick={() => edit()} className={styles.button}>Edit</Button>
                        <Button className={styles.button} variant="contained" color="error" onClick={confirmDeleteContest}>Delete</Button>
                    </div>
                </div>
            )
    );
};

export default ContestEdit;
