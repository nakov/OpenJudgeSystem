/* eslint-disable max-len */
/* eslint-disable no-restricted-imports */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-case-declarations */
/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, MenuItem, Select, TextareaAutosize, TextField, Typography } from '@mui/material';
import { isNaN } from 'lodash';

import { ContestVariation } from '../../../../common/contest-types';
import { IContestAdministration, IContestCategories } from '../../../../common/types';
import { useGetCategoriesQuery } from '../../../../redux/services/admin/contestCategoriesAdminService';
import { useGetContestByIdQuery, useUpdateContestMutation } from '../../../../redux/services/admin/contestsAdminService';
import { Alert, AlertHorizontalOrientation, AlertSeverity, AlertVariant, AlertVerticalOrientation } from '../../../guidelines/alert/Alert';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import ContestDeleteButton from '../../delete/ContestDeleteButton';

// eslint-disable-next-line import/no-unresolved
import styles from './ContestEdit.module.scss';

interface IContestEditProps {
    contestId: number | null;
    isEditMode?: boolean;
}

const ContestEdit = (props:IContestEditProps) => {
    const { contestId, isEditMode = true } = props;

    const { data, isFetching, isLoading } = useGetContestByIdQuery({ id: Number(contestId) }, { skip: !isEditMode });
    const [ message, setMessage ] = useState<string | null>(null);
    const [ isValidForm, setIsValidForm ] = useState<boolean>(!!isEditMode);
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
        isNameValid: !!isEditMode,
        isTypeTouched: false,
        isTypeValid: true,
        isLimitBetweenSubmissionsTouched: false,
        isLimitBetweenSubmissionsValid: true,
        isOrderByTouched: false,
        isOrderByValid: true,
        isNewIpPasswordTouched: false,
        isNewIpPasswordValid: true,
    });

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
    }, [ isSuccesfullyUpdated, updateData ]);

    useEffect(() => {
        if (updateError && !isSuccesfullyUpdated) {
            // The data by default is of type unknown
            setMessage(updateError.data as string);
        } else {
            setMessage(null);
        }
    }, [ isSuccesfullyUpdated, updateError ]);

    const validateForm = () => {
        const isValid = contestValidations.isNameValid &&
        contestValidations.isTypeValid &&
        contestValidations.isLimitBetweenSubmissionsValid &&
        contestValidations.isOrderByValid &&
        contestValidations.isNewIpPasswordValid;
        setIsValidForm(isValid);
    };

    const onChange = (e: any) => {
        // eslint-disable-next-line prefer-destructuring
        const { name, value, checked } = e.target;
        let {
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
        } = contest;
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
            if (!value) {
                contestPassword = null;
            }
            break;
        case 'practicePassword':
            practicePassword = value;
            if (!value) {
                practicePassword = null;
            }
            break;
        case 'allowedIps':
            allowedIps = value;
            break;
        case 'newIpPassword':
            currentContestValidations.isNewIpPasswordTouched = true;
            currentContestValidations.isNewIpPasswordValid = true;
            newIpPassword = value;
            if (!value) {
                newIpPassword = null;
            }
            if (newIpPassword!.length > 20) {
                currentContestValidations.isNewIpPasswordValid = false;
            }
            break;
        case 'description':
            description = value;
            if (!value) {
                description = null;
            }
            break;
        case 'startTime':
            startTime = null;
            if (value) {
                startTime = value;
            }
            break;
        case 'endTime':
            endTime = null;
            if (value) {
                endTime = value;
            }
            break;
        case 'practiceStartTime':
            practiceStartTime = null;
            if (value) {
                practiceStartTime = value;
            }
            break;
        case 'practiceEndTime':
            practiceEndTime = null;
            if (value) {
                practiceEndTime = value;
            }
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
        validateForm();
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

    const edit = () => {
        if (isValidForm) {
            updateContest(contest);
        }
    };

    const create = () => {
        if (isValidForm) {
            console.log('Send Request');
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    };

    return (
        isFetching || isLoading || isGettingCategories || isUpdating
            ? <SpinningLoader />
            : (
                <div className={`${styles.flex}`}>
                    { message && (
                    <Alert
                      variant={AlertVariant.Filled}
                      vertical={AlertVerticalOrientation.Top}
                      horizontal={AlertHorizontalOrientation.Right}
                      severity={updateError
                          ? AlertSeverity.Error
                          : AlertSeverity.Success}
                      message={message}
                    />
                    )}
                    <Typography className={styles.centralize} variant="h4">
                        {contest.name || 'Contest form'}
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
                                <TextField
                                  className={styles.inputRow}
                                  type="number"
                                  name="limitBetweenSubmissions"
                                  label="Limit between submissions"
                                  variant="standard"
                                  onChange={(e) => onChange(e)}
                                  value={contest.limitBetweenSubmissions}
                                  InputLabelProps={{ shrink: true }}
                                  color={contestValidations.isLimitBetweenSubmissionsValid &&
                                    contestValidations.isLimitBetweenSubmissionsTouched
                                      ? 'success'
                                      : 'primary'}
                                  error={(contestValidations.isLimitBetweenSubmissionsTouched &&
                                    !contestValidations.isLimitBetweenSubmissionsValid)}
                                // eslint-disable-next-line max-len
                                  helperText={(contestValidations.isLimitBetweenSubmissionsTouched && !contestValidations.isLimitBetweenSubmissionsValid) &&
                                    'Limit between submissions cannot be less than 0'}
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
                            </Box>
                            <Box>
                                <TextField
                                  className={styles.inputRow}
                                  type="text"
                                  label="Contest Password"
                                  variant="standard"
                                  value={contest.contestPassword || ''}
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
                        <FormControl className={styles.textArea}>
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
                        <Box className={styles.checkboxes}>
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
                    {isEditMode
                        ? (
                            <div className={styles.buttonsWrapper}>
                                <Button variant="contained" onClick={() => edit()} className={styles.button} disabled={!isValidForm}>Edit</Button>
                            </div>
                        )
                        : (
                            <div className={styles.buttonsWrapper}>
                                <Button variant="contained" onClick={() => create()} className={styles.button} disabled={!isValidForm}>Create</Button>
                            </div>
                        )}
                    <Box sx={{ alignSelf: 'flex-end' }}>
                        <ContestDeleteButton contestId={contestId!} contestName={contest.name} onSuccess={() => navigate('/administration-new/contests')} />
                    </Box>
                </div>
            )
    );
};

export default ContestEdit;
