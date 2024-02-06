/* eslint-disable max-len */
/* eslint-disable no-restricted-imports */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-case-declarations */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Select, TextareaAutosize, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { isNaN } from 'lodash';

import { ContestVariation } from '../../../../common/contest-types';
import { ExceptionData, IContestAdministration, IContestCategories } from '../../../../common/types';
import { useGetCategoriesQuery } from '../../../../redux/services/admin/contestCategoriesAdminService';
import { useCreateContestMutation, useDeleteContestMutation, useGetContestByIdQuery, useUpdateContestMutation } from '../../../../redux/services/admin/contestsAdminService';
import { DEFAULT_DATE_FORMAT } from '../../../../utils/constants';
import { Alert, AlertHorizontalOrientation, AlertSeverity, AlertVariant, AlertVerticalOrientation } from '../../../guidelines/alert/Alert';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import DeleteButton from '../../common/delete/DeleteButton';

import styles from './ContestEdit.module.scss';

interface IContestEditProps {
    contestId: number | null;
    isEditMode?: boolean;
}

const ContestEdit = (props:IContestEditProps) => {
    const { contestId, isEditMode = true } = props;

    const navigate = useNavigate();
    const [ errorMessages, setErrorMessages ] = useState<Array<ExceptionData>>([]);
    const [ successMessage, setSuccessMessage ] = useState<string | null>(null);
    const [ isValidForm, setIsValidForm ] = useState<boolean>(!!isEditMode);

    const [ contest, setContest ] = useState<IContestAdministration>({
        allowedIps: '',
        allowParallelSubmissionsInTasks: false,
        autoChangeTestsFeedbackVisibility: false,
        categoryId: 0,
        categoryName: '',
        contestPassword: '',
        description: null,
        endTime: null,
        name: '',
        id: 0,
        isVisible: false,
        limitBetweenSubmissions: 0,
        newIpPassword: '',
        orderBy: 0,
        practiceEndTime: null,
        practicePassword: '',
        practiceStartTime: null,
        startTime: null,
        type: 'Exercise',
        numberOfProblemGroups: 0,
        duration: '',
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
        isDurationTouched: false,
        isDurationValid: true,
    });

    const { data, isFetching, isLoading } = useGetContestByIdQuery({ id: Number(contestId) }, { skip: !isEditMode });
    const { isFetching: isGettingCategories, data: contestCategories } = useGetCategoriesQuery(null);

    const [
        updateContest, {
            data: updateData,
            isLoading: isUpdating,
            isSuccess:
        isSuccesfullyUpdated,
            error: updateError,
        } ] = useUpdateContestMutation();

    const [
        createContest, {
            data: createData,
            isSuccess: isSuccesfullyCreated,
            error: createError,
            isLoading: isCreating,
        } ] = useCreateContestMutation();

    useEffect(
        () => {
            if (data) {
                setContest(data);
            }
        },
        [ data ],
    );

    useEffect(() => {
        setErrorMessages([]);
        if (isSuccesfullyUpdated) {
            setSuccessMessage(updateData as string);
            setErrorMessages([]);
        } if (isSuccesfullyCreated) {
            setSuccessMessage(createData as string);
            setErrorMessages([]);
        }
    }, [ isSuccesfullyUpdated, updateData, createData, isSuccesfullyCreated ]);

    useEffect(() => {
        if (updateError && !isSuccesfullyUpdated) {
            setSuccessMessage(null);
            setErrorMessages(updateError as Array<ExceptionData>);
        } else if (createError && !isSuccesfullyCreated) {
            setSuccessMessage(null);
            setErrorMessages(createError as Array<ExceptionData>);
        } else {
            setErrorMessages([]);
        }
    }, [ createError, isSuccesfullyCreated, isSuccesfullyUpdated, updateError ]);

    const validateForm = () => {
        const isValid = contestValidations.isNameValid &&
        contestValidations.isTypeValid &&
        contestValidations.isLimitBetweenSubmissionsValid &&
        contestValidations.isOrderByValid &&
        contestValidations.isNewIpPasswordValid &&
        contestValidations.isDurationValid;
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
            numberOfProblemGroups,
            duration,
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
                startTime = new Date(dayjs(e.target.value).format(DEFAULT_DATE_FORMAT));
            }
            break;
        case 'endTime':
            endTime = null;
            if (value) {
                endTime = new Date(dayjs(e.target.value).format(DEFAULT_DATE_FORMAT));
            }
            break;
        case 'practiceStartTime':
            practiceStartTime = null;
            if (value) {
                practiceStartTime = new Date(dayjs(e.target.value).format(DEFAULT_DATE_FORMAT));
            }
            break;
        case 'practiceEndTime':
            practiceEndTime = null;
            if (value) {
                practiceEndTime = new Date(dayjs(e.target.value).format(DEFAULT_DATE_FORMAT));
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
        case 'numberOfProblemGroups':
            if (value) {
                numberOfProblemGroups = Number(value);
            }
            break;
        case 'duration':
            let currentValue = value;

            if (currentValue === '') {
                currentValue = null;
            }

            const timeSpanRegex = /^-?(\d+\.)?(\d{1,2}):(\d{2}):(\d{2})(\.\d{1,7})?$/;
            currentContestValidations.isDurationValid = timeSpanRegex.test(value) || currentValue === null;
            currentContestValidations.isDurationTouched = true;
            duration = currentValue;
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
            numberOfProblemGroups,
            duration,
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

    const handleDateTimePickerChange = (name: string, newValue:any) => {
        const event = {
            target: {
                name,
                value: newValue
                    ? newValue.toString()
                    : null,
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
            createContest(contest);
        }
    };

    return (
        isFetching || isLoading || isGettingCategories || isUpdating || isCreating
            ? <SpinningLoader />
            : (
                <div className={`${styles.flex}`}>
                    {errorMessages.map((x, i) => (
                        <Alert
                          key={x.name}
                          variant={AlertVariant.Filled}
                          vertical={AlertVerticalOrientation.Top}
                          horizontal={AlertHorizontalOrientation.Right}
                          severity={AlertSeverity.Error}
                          message={x.message}
                          styles={{ marginTop: `${i * 4}rem` }}
                        />
                    ))}
                    {successMessage && (
                        <Alert
                          variant={AlertVariant.Filled}
                          autoHideDuration={3000}
                          vertical={AlertVerticalOrientation.Top}
                          horizontal={AlertHorizontalOrientation.Right}
                          severity={AlertSeverity.Success}
                          message={successMessage}
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
                                  helperText={(contestValidations.isOrderByTouched && !contestValidations.isOrderByValid) && 'Order by cannot be less than 0'}
                                />
                                <TextField
                                  className={styles.inputRow}
                                  type="number"
                                  label="Number of problem groups"
                                  variant="standard"
                                  value={contest.numberOfProblemGroups}
                                  onChange={(e) => onChange(e)}
                                  InputLabelProps={{ shrink: true }}
                                  name="numberOfProblemGroups"
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
                                  placeholder="Split by ;"
                                  value={contest.allowedIps}
                                  onChange={(e) => onChange(e)}
                                  InputLabelProps={{ shrink: true }}
                                  name="allowedIps"
                                />
                                <TextField
                                  className={styles.inputRow}
                                  type="string"
                                  label="Duration"
                                  variant="standard"
                                  value={contest.duration}
                                  onChange={(e) => onChange(e)}
                                  InputLabelProps={{ shrink: true }}
                                  name="duration"
                                  error={(contestValidations.isDurationTouched && !contestValidations.isDurationValid)}
                                  helperText={(contestValidations.isDurationTouched && !contestValidations.isDurationValid) && 'Duration must be valid time with format hh:mm:ss'}
                                />
                            </Box>
                        </Box>
                        <FormControl
                          className={styles.inputRow}
                        >
                            <InputLabel id="contest-type">Type</InputLabel>
                            <Select
                              sx={{ width: '100%' }}
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
                        <FormControl className={styles.textArea} sx={{ margin: '20px 0' }}>
                            <Autocomplete
                              sx={{ width: '100%' }}
                              className={styles.inputRow}
                              onChange={(event, newValue) => handleAutocompleteChange('category', newValue!)}
                              value={contestCategories?.find((category) => category.id === contest.categoryId) ?? contestCategories![0]}
                              options={contestCategories!}
                              renderInput={(params) => <TextField {...params} label="Select Category" key={params.id} />}
                              getOptionLabel={(option) => option?.name}
                              renderOption={(properties, option) => (
                                  <MenuItem {...properties} key={option.id} value={option.id}>
                                      {option.name}
                                  </MenuItem>
                              )}
                            />
                        </FormControl>
                        <div className={styles.row}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                  sx={{ width: '48%' }}
                                  name="startTime"
                                  label="Start Time"
                                  value={contest.startTime
                                      ? dayjs(contest.startTime)
                                      : null}
                                  onChange={(newValue) => handleDateTimePickerChange('startTime', newValue)}
                                />
                                <DateTimePicker
                                  sx={{ width: '48%' }}
                                  name="endTime"
                                  label="End Time"
                                  value={contest.endTime
                                      ? dayjs(contest.endTime)
                                      : null}
                                  onChange={(newValue) => handleDateTimePickerChange('endTime', newValue)}
                                />
                            </LocalizationProvider>
                        </div>
                        <div className={styles.row}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                  sx={{ width: '48%', margin: '20px 0' }}
                                  name="practiceStartTime"
                                  label="Practice Start Time"
                                  value={contest.practiceStartTime
                                      ? dayjs(contest.practiceStartTime)
                                      : null}
                                  onChange={(newValue) => handleDateTimePickerChange('practiceStartTime', newValue)}
                                />
                                <DateTimePicker
                                  sx={{ width: '48%', margin: '20px 0' }}
                                  name="practiceEndTime"
                                  label="Practice End Time"
                                  value={contest.practiceEndTime
                                      ? dayjs(contest.practiceEndTime)
                                      : null}
                                  onChange={(newValue) => handleDateTimePickerChange('practiceEndTime', newValue)}
                                />
                            </LocalizationProvider>
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
                                <Button
                                  variant="contained"
                                  onClick={() => edit()}
                                  className={styles.button}
                                  disabled={!isValidForm}
                                >
                                    Edit
                                </Button>
                            </div>
                        )
                        : (
                            <div className={styles.buttonsWrapper}>
                                <Button
                                  variant="contained"
                                  onClick={() => create()}
                                  className={styles.button}
                                  disabled={!isValidForm}
                                >
                                    Create
                                </Button>
                            </div>
                        )}
                    <Box sx={{ alignSelf: 'flex-end' }}>
                        <DeleteButton
                          id={Number(contestId!)}
                          name={contest.name}
                          onSuccess={() => navigate('/administration-new/contests')}
                          mutation={useDeleteContestMutation}
                          text="Are you sure that you want to delete the contest."
                        />
                    </Box>
                </div>
            )
    );
};

export default ContestEdit;
