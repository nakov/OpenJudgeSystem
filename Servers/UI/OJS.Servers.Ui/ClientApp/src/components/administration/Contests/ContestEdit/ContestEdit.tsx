/* eslint-disable no-case-declarations */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, AutocompleteRenderInputParams, Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Select, TextareaAutosize, TextField, Typography } from '@mui/material';
// eslint-disable-next-line no-restricted-imports
import { isNaN } from 'lodash';

import { ContestVariation } from '../../../../common/contest-types';
import { IContestAdministration, IContestCategories } from '../../../../common/types';
import { useGetCategoriesQuery } from '../../../../redux/services/admin/contestCategoriesAdminService';
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
    const [ message, setMessage ] = useState<string | null>(undefined);
    // eslint-disable-next-line max-len
    const [ updateContest, { data: updateData, isLoading: isUpdating, isSuccess: isSuccesfullyUpdated, error: updateError } ] = useUpdateContestMutation();
    const navigate = useNavigate();
    const { isFetching: isGettingCategories, data: contestCategories } = useGetCategoriesQuery(null);

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
    const [ contestValidations, setContestValidations ] = useState({
        isNameTouched: false,
        isNameValid: false,
        isTypeTouched: false,
        isTypeValid: true,
        isLimitBetweenSubmissionsTouched: false,
        isLimitBetweenSubmissionsValid: true,
        isOrderByTouched: false,
        isOrderByValid: true,
        isNewIpPasswordTouched: false,
        isNewIpPasswordValid: true,
    });

    const [ deleteContest, { data: deleteData, isLoading: isDeleting, isSuccess, error: deleteError } ] = useDeleteContestMutation();
    useEffect(
        () => {
            if (data) {
                setContest(data);
            }
        },
        [ data ],
    );

    useEffect(() => {
        setMessage(null);
        if (isSuccesfullyUpdated) {
            setMessage(updateData as string);
        }
        if (isSuccess) {
            setMessage(deleteData as string);
        }
    }, [ deleteData, isSuccesfullyUpdated, isSuccess, updateData ]);

    useEffect(() => {
        if (deleteError && !isSuccess) {
            // The data by default is of type unknown
            setMessage(deleteError.data as string);
        } else if (updateError && !isSuccess) {
            // The data by default is of type unknown
            setMessage(updateError.data as string);
        } else {
            setMessage(null);
        }
    }, [ deleteError, isSuccess, updateError ]);

    const onChange = (e: any) => {
        const { name, value, checked } = e.target;
        let contestName = contest.name;
        let contestType = contest.type;
        let limitBetweenSubmissions = contest.limitBetweenSubmissions;
        let orderBy = contest.orderBy;
        let contestPassword = contest.contestPassword;
        let practicePassword = contest.practicePassword;
        let allowedIps = contest.allowedIps;
        let newIpPassword = contest.newIpPassword;
        let description = contest.description;
        let startTime = contest.startTime;
        let endTime = contest.endTime;
        let practiceStartTime = contest.practiceStartTime;
        let practiceEndTime = contest.practiceEndTime;
        let isVisible = contest.isVisible;
        let allowParallelSubmissionsInTasks = contest.allowParallelSubmissionsInTasks;
        let autoChangeTestsFeedbackVisibility = contest.autoChangeTestsFeedbackVisibility;
        let categoryId = contest.categoryId;
        let categoryName = contest.categoryName;
        const currentContestValidations = contestValidations;
        // eslint-disable-next-line default-case
        switch (name) {
        case 'name':
            contestName = value;
            currentContestValidations.isNameTouched = true;
            currentContestValidations.isNameValid = true;
            if (value.length < 4 || value.length > 100) {
                currentContestValidations.isNameValid = false;
            }
            break;
        case 'type':
            contestType = value;
            currentContestValidations.isTypeTouched = true;
            // eslint-disable-next-line no-case-declarations
            const isValid = !!Object.keys(ContestVariation).filter((key) => isNaN(Number(key))).some((x) => x === value);
            currentContestValidations.isTypeValid = isValid;
            break;
        case 'limitBetweenSubmissions':
            currentContestValidations.isLimitBetweenSubmissionsTouched = true;
            currentContestValidations.isLimitBetweenSubmissionsValid = true;
            limitBetweenSubmissions = value;
            if (value < 0) {
                currentContestValidations.isLimitBetweenSubmissionsValid = false;
            }
            break;
        case 'orderBy':
            currentContestValidations.isOrderByTouched = true;
            currentContestValidations.isOrderByValid = true;
            orderBy = value;
            if (value < 0) {
                currentContestValidations.isOrderByValid = false;
            }
            break;
        case 'contestPassword':
            contestPassword = value;
            break;
        case 'practicePassword':
            practicePassword = value;
            break;
        case 'allowedIps':
            allowedIps = value;
            break;
        case 'newIpPassword':
            currentContestValidations.isNewIpPasswordTouched = true;
            currentContestValidations.isNewIpPasswordValid = true;
            newIpPassword = value;
            if (newIpPassword!.length > 20) {
                currentContestValidations.isNewIpPasswordValid = false;
            }
            break;
        case 'description':
            description = value;
            break;
        case 'startTime':
            startTime = value;
            break;
        case 'endTime':
            endTime = value;
            break;
        case 'practiceStartTime':
            practiceStartTime = value;
            break;
        case 'practiceEndTime':
            practiceEndTime = value;
            break;
        case 'isVisible':
            isVisible = checked;
            break;
        case 'allowParallelSubmissionsInTasks':
            allowParallelSubmissionsInTasks = checked;
            break;
        case 'autoChangeTestsFeedbackVisibility':
            autoChangeTestsFeedbackVisibility = checked;
            break;
        case 'category':
            const category = contestCategories?.find((cc) => cc.id === value);
            if (category) {
                categoryId = category.id;
                categoryName = category.name;
            }
            break;
        }
        setContestValidations(currentContestValidations);
        setContest((prevState) => ({
            ...prevState,
            name: contestName,
            type: contestType,
            limitBetweenSubmissions,
            orderBy,
            contestPassword,
            practicePassword,
            allowedIps,
            newIpPassword,
            description,
            startTime,
            endTime,
            practiceStartTime,
            practiceEndTime,
            isVisible,
            allowParallelSubmissionsInTasks,
            autoChangeTestsFeedbackVisibility,
            categoryId,
            categoryName,
        }));
    };

    const handleAutocompleteChange = (name: string, newValue:IContestCategories) => {
        const event = {
            target: {
                name,
                value: newValue?.id,
            },
        };
        onChange(event);
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
        isFetching || isLoading || isDeleting || isGettingCategories
            ? <SpinningLoader />
            : (
                <div className={`${styles.flex}`}>
                    {/* { message && (
                    <Alert
                      variant={AlertVariant.Filled}
                      vertical={AlertVerticalOrientation.Top}
                      horizontal={AlertHorizontalOrientation.Right}
                      severity={deleteError || updateError
                          ? AlertSeverity.Error
                          : AlertSeverity.Success}
                      message={message}
                    />
                    )} */}
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
                                  color={contestValidations.isNameValid && contestValidations.isNameTouched
                                      ? 'success'
                                      : 'primary'}
                                  error={(contestValidations.isNameTouched && !contestValidations.isNameValid)}
                                  // eslint-disable-next-line max-len
                                  helperText={(contestValidations.isNameTouched && !contestValidations.isNameValid) && 'Contest name length must be between 4 and 100 characters long'}
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
                                      onBlur={(e) => onChange(e)}
                                      color={contestValidations.isTypeValid && contestValidations.isTypeTouched
                                          ? 'success'
                                          : 'primary'}
                                      error={(contestValidations.isTypeTouched && !contestValidations.isTypeValid)}
                                    >
                                        {Object.keys(ContestVariation).filter((key) => isNaN(Number(key))).map((key) => (
                                            <MenuItem key={key} value={key}>
                                                {key}
                                            </MenuItem>
                                        ))}
                                        helperText=
                                        {(contestValidations.isTypeTouched && !contestValidations.isTypeValid) &&
                                        'Contest type is invalid'}
                                    </Select>
                                </FormControl>
                                <Autocomplete
                                  className={styles.inputRow}
                                  onChange={(event, newValue) => handleAutocompleteChange('category', newValue!)}
                                  value={contestCategories?.find((category) => category.id === contest.categoryId) ?? contestCategories![0]}
                                  options={contestCategories!}
                                  renderInput={(params) => <TextField {...params} label="Select Option" key={params.id} />}
                                  getOptionLabel={(option) => option?.name}
                                  renderOption={(properties, option) => (
                                      <MenuItem {...properties} key={option.id} value={option.id}>
                                          {option.name}
                                      </MenuItem>
                                  )}
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
                                  color={contestValidations.isLimitBetweenSubmissionsValid && contestValidations.isLimitBetweenSubmissionsTouched
                                      ? 'success'
                                      : 'primary'}
                                  error={(contestValidations.isLimitBetweenSubmissionsTouched && !contestValidations.isLimitBetweenSubmissionsValid)}
                                // eslint-disable-next-line max-len
                                  helperText={(contestValidations.isLimitBetweenSubmissionsTouched && !contestValidations.isLimitBetweenSubmissionsValid) && 'Limit between submissions cannot be less than 0'}
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
                                  color={contestValidations.isNewIpPasswordValid && contestValidations.isNewIpPasswordTouched
                                      ? 'success'
                                      : 'primary'}
                                  error={(contestValidations.isNewIpPasswordTouched && !contestValidations.isNewIpPasswordValid)}
                            // eslint-disable-next-line max-len
                                  helperText={(contestValidations.isNewIpPasswordTouched && !contestValidations.isNewIpPasswordValid) && 'New Ip password cannot be more than 20 characters long'}
                                />
                                <TextField
                                  className={styles.inputRow}
                                  type="number"
                                  label="Order By"
                                  variant="standard"
                                  value={contest.orderBy}
                                  onChange={(e) => onChange(e)}
                                  InputLabelProps={{ shrink: true }}
                                  name="orderBy"
                                  color={contestValidations.isOrderByValid && contestValidations.isOrderByTouched
                                      ? 'success'
                                      : 'primary'}
                                  error={(contestValidations.isOrderByTouched && !contestValidations.isOrderByValid)}
                              // eslint-disable-next-line max-len
                                  helperText={(contestValidations.isOrderByTouched && !contestValidations.isOrderByValid) && 'Order by cannot be less than 0'}
                                />
                                <TextField
                                  className={styles.inputRow}
                                  type="text"
                                  label="Allowed Ips"
                                  variant="standard"
                                  placeholder="Split by ,"
                                  value={contest.allowedIps}
                                  onChange={(e) => onChange(e)}
                                  InputLabelProps={{ shrink: true }}
                                  name="allowedIps"
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
