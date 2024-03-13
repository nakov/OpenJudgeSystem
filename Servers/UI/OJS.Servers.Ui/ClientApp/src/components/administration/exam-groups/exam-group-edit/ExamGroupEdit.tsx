/* eslint-disable no-case-declarations */
/* eslint-disable no-undefined */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, Box, Button, FormControl, MenuItem, TextField, Typography } from '@mui/material';

import {
    ExceptionData,
    IContestCategories,
    IExamGroupAdministration,
} from '../../../../common/types';
import { useGetContestsForDropdownQuery } from '../../../../redux/services/admin/contestsAdminService';
import {
    useCreateExamGroupMutation, useDeleteExamGroupMutation, useGetExamGroupByIdQuery,
    useUpdateExamGroupMutation,
} from '../../../../redux/services/admin/examGroupsAdminService';
import { Alert, AlertHorizontalOrientation, AlertSeverity, AlertVariant, AlertVerticalOrientation } from '../../../guidelines/alert/Alert';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import DeleteButton from '../../common/delete/DeleteButton';

// eslint-disable-next-line css-modules/no-unused-class
import styles from './ExamGroupEdit.module.scss';

interface IExamGroupEditProps {
    examGroupId: number | null;
    isEditMode?: boolean;
}

const ExamGroupEdit = (props:IExamGroupEditProps) => {
    const { examGroupId, isEditMode = true } = props;

    const navigate = useNavigate();
    const [ errorMessages, setErrorMessages ] = useState<Array<ExceptionData>>([]);
    const [ successMessage, setSuccessMessage ] = useState<string | null>(null);
    const [ isValidForm, setIsValidForm ] = useState<boolean>(!!isEditMode);

    const [ examGroup, setExamGroup ] = useState<IExamGroupAdministration>({
        id: 0,
        name: '',
        contest: '',
        contestId: 0,
        externalAppId: '',
        externalExamGroupId: 0,
    });
    const [ examGroupValidations, setExamGroupValidations ] = useState({
        isNameTouched: false,
        isNameValid: !!isEditMode,
    });

    const { data, isFetching, isLoading } = useGetExamGroupByIdQuery({ id: Number(examGroupId) }, { skip: !isEditMode });
    const { isFetching: isGettingContests, data: contestsForDropdown } = useGetContestsForDropdownQuery(null);

    const [
        updateExamGroup, {
            data: updateData,
            isLoading: isUpdating,
            isSuccess:
                isSuccesfullyUpdated,
            error: updateError,
        } ] = useUpdateExamGroupMutation();

    const [
        createExamGroup, {
            data: createData,
            isSuccess: isSuccesfullyCreated,
            error: createError,
            isLoading: isCreating,
        } ] = useCreateExamGroupMutation();

    useEffect(
        () => {
            if (data) {
                setExamGroup(data);
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
        const isValid = examGroupValidations.isNameValid;
        setIsValidForm(isValid);
    };

    const onChange = (e: any) => {
        // eslint-disable-next-line prefer-destructuring
        const { name, value } = e.target;
        let {
            name: examGroupName,
            contest,
            contestId,
        } = examGroup;
        const currentExamGroupValidations = examGroupValidations;
        // eslint-disable-next-line default-case
        switch (name) {
        case 'name':
            examGroupName = value;
            currentExamGroupValidations.isNameTouched = true;
            currentExamGroupValidations.isNameValid = true;
            if (value.length < 2 || value.length > 600) {
                currentExamGroupValidations.isNameValid = false;
            }
            break;
        case 'contest':
            const selectedContest = contestsForDropdown?.find((c) => c.id === value);
            if (selectedContest) {
                contestId = selectedContest!.id;
                contest = selectedContest!.name;
            }
            break;
        }
        setExamGroupValidations(currentExamGroupValidations);
        setExamGroup((prevState) => ({
            ...prevState,
            name: examGroupName,
            contest,
            contestId,
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
            updateExamGroup(examGroup);
        }
    };

    const create = () => {
        if (isValidForm) {
            createExamGroup(examGroup);
        }
    };

    return (
        isFetching || isLoading || isUpdating || isCreating || isGettingContests
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
                        {examGroup.name || 'Exam group form'}
                    </Typography>
                    <form className={`${styles.form}`}>
                        {isEditMode && (
                            <TextField
                              className={styles.inputRow}
                              label="Exam Group Id"
                              variant="standard"
                              value={examGroup.id}
                              disabled
                            />
                        )}
                        <TextField
                          className={styles.inputRow}
                          label="Name"
                          variant="standard"
                          name="name"
                          onChange={(e) => onChange(e)}
                          value={examGroup.name}
                          color={examGroupValidations.isNameValid && examGroupValidations.isNameTouched
                              ? 'success'
                              : 'primary'}
                          error={(examGroupValidations.isNameTouched && !examGroupValidations.isNameValid)}
                            // eslint-disable-next-line max-len
                          helperText={(examGroupValidations.isNameTouched && !examGroupValidations.isNameValid) && 'Exam Group name length must be between 2 and 600 characters long'}
                        />
                        <FormControl className={styles.textArea} sx={{ margin: '20px 0' }}>
                            <Autocomplete
                              sx={{ width: '100%' }}
                              className={styles.inputRow}
                              onChange={(event, newValue) => handleAutocompleteChange('contest', newValue!)}
                              value={contestsForDropdown?.find((contest) => contest.id === examGroup.contestId) ?? null}
                              options={contestsForDropdown!}
                              renderInput={(params) => <TextField {...params} label="Contest" key={params.id} />}
                              getOptionLabel={(option) => option?.name}
                              renderOption={(properties, option) => (
                                  <MenuItem {...properties} key={option.id} value={option.id}>
                                      {option.name}
                                  </MenuItem>
                              )}
                            />
                        </FormControl>
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
                          id={Number(examGroupId!)}
                          name={examGroup.name}
                          onSuccess={() => navigate('/administration-new/examGroups')}
                          mutation={useDeleteExamGroupMutation}
                          text="Are you sure that you want to delete the exam group?"
                        />
                    </Box>
                </div>
            )
    );
};

export default ExamGroupEdit;
